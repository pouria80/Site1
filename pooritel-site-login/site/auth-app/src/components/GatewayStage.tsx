import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useI18n } from "../i18n";
import { BoltIcon, GamepadIcon, GemMark, TelegramIcon } from "./icons";

export type GatePhase =
  | "idle"
  | "activating"
  | "converging"
  | "synced"
  | "reveal"
  | "ready";

/* timing (ms) — total to card ≈ 1.9s */
const T_ACT = 360;
const T_CONV = 880;
const T_SYNC = 380;
const T_REVEAL = T_ACT + T_CONV + T_SYNC; // 1620
const T_OPEN = T_REVEAL + 260; // card appears
const T_READY = T_REVEAL + 700; // stage exits

const RADII_F = [0.245, 0.335, 0.425]; // the three orbital rings
const R_SYNC = 92; // orbit radius while syncing around the core

/* natural slow orbit around the core (rad/s) — alternating directions */
const OMEGA = [0.3, -0.24, 0.19];
/* where each orb starts on its ring */
const START_ANGLES = [-Math.PI / 2, Math.PI / 6, (Math.PI * 5) / 6];

/* the sorcerer's orbs — game colors: Quas ice, Wex storm, Exort fire.
   Each carries a PooriTel glyph: Telegram, lightning (gaming speed),
   and a gamepad (digital goods). */
const ORB_DEFS = [
  {
    cls: "orb-c",
    rgb: [89, 216, 232] as [number, number, number],
    Glyph: TelegramIcon,
  },
  {
    cls: "orb-s",
    rgb: [139, 92, 246] as [number, number, number],
    Glyph: BoltIcon,
  },
  {
    cls: "orb-g",
    rgb: [255, 138, 60] as [number, number, number],
    Glyph: GamepadIcon,
  },
];

type Trail = { x: number; y: number; life: number };
type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  rgb: [number, number, number];
  a: number;
};
type Dust = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  f: number;
  p: number;
  rgb: [number, number, number];
};

interface Sim {
  phase: GatePhase;
  raf: number;
  tPrev: number;
  box: number;
  cx: number;
  cy: number;
  angles: number[];
  rads: number[];
  mul: number;
  pos: { x: number; y: number }[];
  orbR: number;
  convT0: number;
  syncT0: number;
  revT0: number;
  reformT0: number;
  trails: Trail[][];
  trailA: number;
  sparks: Spark[];
  dust: Dust[];
  sparkAcc: number[];
  timeouts: number[];
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const DUST_COLORS: [number, number, number][] = [
  [89, 216, 232],
  [139, 92, 246],
  [255, 176, 96],
  [150, 161, 181],
];

export default function GatewayStage({
  reduced,
  onOpen,
  onPhase,
}: {
  reduced: boolean;
  onOpen: () => void;
  onPhase?: (p: GatePhase) => void;
}) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<GatePhase>("idle");
  const [burst, setBurst] = useState(false);
  const [popped, setPopped] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbEls = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const ringEls = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const onOpenRef = useRef(onOpen);
  const reducedRef = useRef(reduced);
  onOpenRef.current = onOpen;
  reducedRef.current = reduced;

  const onPhaseRef = useRef(onPhase);
  onPhaseRef.current = onPhase;
  const goPhase = useCallback((p: GatePhase) => {
    setPhase(p);
    if (onPhaseRef.current) onPhaseRef.current(p);
  }, []);

  const sim = useRef<Sim>({
    phase: "idle",
    raf: 0,
    tPrev: 0,
    box: 0,
    cx: 0,
    cy: 0,
    angles: [...START_ANGLES],
    rads: [0, 0, 0],
    mul: 1,
    pos: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    orbR: 19,
    convT0: 0,
    syncT0: 0,
    revT0: 0,
    reformT0: 0,
    trails: [[], [], []],
    trailA: 0.13,
    sparks: [],
    dust: [],
    sparkAcc: [0, 0, 0],
    timeouts: [],
  });

  /* ---------------------------------------------------------- */
  /* geometry + canvas sizing                                    */
  /* ---------------------------------------------------------- */
  const measure = useCallback(() => {
    const s = sim.current;
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    if (!field || !canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rect = field.getBoundingClientRect();
    s.box = rect.width;
    s.cx = rect.left + rect.width / 2;
    s.cy = rect.top + rect.height / 2;

    for (let i = 0; i < 3; i++) {
      const d = `${RADII_F[i] * 2 * s.box}px`;
      if (ringEls.current[i]) {
        ringEls.current[i]!.style.width = d;
        ringEls.current[i]!.style.height = d;
      }
    }

    if (orbEls.current[0]) {
      s.orbR = orbEls.current[0].offsetWidth / 2 || 19;
    }

    /* at rest the orbs ride their orbital rings around the core */
    if (s.phase === "idle" || s.phase === "ready" || reducedRef.current) {
      for (let i = 0; i < 3; i++) {
        const r = RADII_F[i] * s.box;
        s.rads[i] = r;
        const x = s.cx + Math.cos(START_ANGLES[i]) * r;
        const y = s.cy + Math.sin(START_ANGLES[i]) * r;
        s.pos[i] = { x, y };
        const el = orbEls.current[i];
        if (el) {
          el.style.left = `${(x - s.orbR).toFixed(1)}px`;
          el.style.top = `${(y - s.orbR).toFixed(1)}px`;
        }
      }
    }

    /* ambient dust */
    const count = Math.round(
      Math.max(24, Math.min(70, (W * H) / 26000))
    );
    s.dust = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 3,
      vy: -(2.5 + Math.random() * 6.5),
      a: 0.04 + Math.random() * 0.08,
      f: 0.4 + Math.random() * 0.9,
      p: Math.random() * Math.PI * 2,
      rgb: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
    }));
  }, []);

  /* ---------------------------------------------------------- */
  /* drawing                                                     */
  /* ---------------------------------------------------------- */
  const draw = useCallback((now: number, dt: number) => {
    const s = sim.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    ctx.clearRect(0, 0, W, H);

    /* ambient dust */
    for (const d of s.dust) {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      if (d.y < -8) {
        d.y = H + 8;
        d.x = Math.random() * W;
      }
      if (d.x < -8) d.x = W + 8;
      if (d.x > W + 8) d.x = -8;
      const tw = 0.62 + 0.38 * Math.sin(now * 0.001 * d.f + d.p);
      ctx.fillStyle = `rgba(${d.rgb[0]},${d.rgb[1]},${d.rgb[2]},${(d.a * tw).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* orb trails — soft expanding wisps of magical smoke */
    for (let i = 0; i < 3; i++) {
      const arr = s.trails[i];
      const rgb = ORB_DEFS[i].rgb;
      for (const pt of arr) {
        pt.life -= dt * 1.4;
        if (pt.life <= 0) continue;
        const age = 1 - pt.life;
        const a = Math.pow(pt.life, 1.4) * s.trailA;
        const r = 1.2 + pt.life * 2 + age * 5.5; /* puff grows as it fades */
        /* soft outer smoke */
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(a * 0.22).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r * 2.1, 0, Math.PI * 2);
        ctx.fill();
        /* bright core of the wisp */
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      s.trails[i] = arr.filter((pt) => pt.life > 0);
    }

    /* soft glow pooled under each orb while it travels */
    if (s.phase === "converging" || s.phase === "synced" || s.phase === "reveal") {
      for (let i = 0; i < 3; i++) {
        const rgb = ORB_DEFS[i].rgb;
        const g = ctx.createRadialGradient(
          s.pos[i].x, s.pos[i].y, 0,
          s.pos[i].x, s.pos[i].y, 46
        );
        g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.22)`);
        g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.pos[i].x, s.pos[i].y, 46, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* sparks (orb emissions + gateway burst) */
    const alive: Spark[] = [];
    for (const sp of s.sparks) {
      sp.life -= dt;
      if (sp.life <= 0) continue;
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.vx *= 1 - 1.7 * dt;
      sp.vy *= 1 - 1.7 * dt;
      const k = sp.life / sp.max;
      const rad = sp.r * (0.6 + k * 0.4);
      /* soft glow halo */
      ctx.fillStyle = `rgba(${sp.rgb[0]},${sp.rgb[1]},${sp.rgb[2]},${(k * sp.a * 0.16).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, rad * 3.4, 0, Math.PI * 2);
      ctx.fill();
      /* bright spark core */
      ctx.fillStyle = `rgba(${sp.rgb[0]},${sp.rgb[1]},${sp.rgb[2]},${(k * sp.a).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, rad, 0, Math.PI * 2);
      ctx.fill();
      alive.push(sp);
    }
    s.sparks = alive;
  }, []);

  /* ---------------------------------------------------------- */
  /* main loop — the orbs are the actors now                     */
  /* ---------------------------------------------------------- */
  const loop = useCallback(
    (now: number) => {
      const s = sim.current;
      const dt = Math.min(0.05, s.tPrev ? (now - s.tPrev) / 1000 : 0.016);
      s.tPrev = now;
      const tSec = now * 0.001;

      if (s.box > 0) {
        /* trail strength per phase — always a faint magical wake */
        if (s.phase === "idle") s.trailA = 0.055;
        else if (s.phase === "activating") s.trailA = 0.12;
        else if (s.phase === "converging")
          s.trailA = lerp(0.2, 0.5, clamp01((now - s.convT0) / T_CONV));
        else if (s.phase === "synced") s.trailA = 0.5;
        else if (s.phase === "reveal") s.trailA = 0.3;
        else s.trailA = 0.05;

        /* orbital speed ramps up gently as power gathers */
        const mulTarget =
          s.phase === "idle" ? 1 : s.phase === "activating" ? 1.9 : 1;
        s.mul += (mulTarget - s.mul) * Math.min(1, dt * 2.2);

        for (let i = 0; i < 3; i++) {
          const dir = Math.sign(OMEGA[i]);
          let r = s.rads[i] || RADII_F[i] * s.box;
          let omega = OMEGA[i] * s.mul;

          if (s.phase === "idle" || s.phase === "activating") {
            /* natural slow orbit on the ring, with a lazy radial breath */
            r = RADII_F[i] * s.box + Math.sin(tSec * 0.42 + i * 2.1) * 4;
          } else if (s.phase === "converging") {
            /* spiral inward — radius tightens while the angle keeps running */
            const e = easeInOutCubic(clamp01((now - s.convT0) / T_CONV));
            r = lerp(RADII_F[i] * s.box, R_SYNC, e);
            omega = lerp(OMEGA[i] * 1.9, dir * 2.2, e);
          } else if (s.phase === "synced") {
            /* hugging the core rim — the invocation aligns */
            const p = easeOutQuart(clamp01((now - s.syncT0) / T_SYNC));
            r = lerp(R_SYNC, R_SYNC - 9, p) + Math.sin(now * 0.007 + i * 2.1) * 2;
            omega = dir * (2.6 + p * 0.7);
          } else if (s.phase === "reveal") {
            /* swallowed by the core */
            const m = easeInOutCubic(clamp01((now - s.revT0) / 240));
            r = lerp(s.rads[i], 10, Math.min(1, m * 1.35));
            omega = dir * 3.6;
          } else if (s.phase === "ready") {
            /* drift back out to the rings and keep a calm watch */
            const q = easeOutCubic(clamp01((now - s.reformT0) / 900));
            r = lerp(14, RADII_F[i] * s.box, q);
            omega = OMEGA[i];
          }

          s.rads[i] = r;
          s.angles[i] += omega * dt;
          const x = s.cx + Math.cos(s.angles[i]) * r;
          const y = s.cy + Math.sin(s.angles[i]) * r;
          s.pos[i] = { x, y };

          const el = orbEls.current[i];
          if (el) {
            el.style.left = `${(x - s.orbR).toFixed(1)}px`;
            el.style.top = `${(y - s.orbR).toFixed(1)}px`;
          }

          if (s.phase !== "reveal") {
            s.trails[i].push({ x, y, life: 1 });
            if (s.trails[i].length > 16) s.trails[i].shift();
          }

          /* living emissions around each orb */
          s.sparkAcc[i] += dt;
          const interval = s.phase === "idle" ? 0.5 : s.phase === "activating" ? 0.28 : 0.16;
          if (s.sparkAcc[i] > interval && s.sparks.length < 160 && s.phase !== "reveal") {
            s.sparkAcc[i] = 0;
            const ang = Math.random() * Math.PI * 2;
            const sp = 6 + Math.random() * 15;
            const rising = i === 2 ? -11 : 0; /* fire embers rise */
            s.sparks.push({
              x: x + (Math.random() - 0.5) * 12,
              y: y + (Math.random() - 0.5) * 12,
              vx: Math.cos(ang) * sp,
              vy: Math.sin(ang) * sp + rising,
              life: 0.7 + Math.random() * 0.5,
              max: 1.1,
              r: 1 + Math.random() * 1.1,
              rgb: ORB_DEFS[i].rgb,
              a: 0.5,
            });
          }
        }
      }

      draw(now, dt);
      s.raf = requestAnimationFrame(loop);
    },
    [draw]
  );

  /* ---------------------------------------------------------- */
  /* burst particles                                             */
  /* ---------------------------------------------------------- */
  const spawnBurst = useCallback(() => {
    const s = sim.current;
    const colors: [number, number, number][] = [
      [89, 216, 232],
      [139, 92, 246],
      [255, 176, 96],
      [255, 255, 255],
    ];
    for (let i = 0; i < 52; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 50 + Math.random() * 140;
      const life = 0.55 + Math.random() * 0.5;
      s.sparks.push({
        x: s.cx,
        y: s.cy,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life,
        max: life,
        r: 1.1 + Math.random() * 1.8,
        rgb: colors[Math.floor(Math.random() * colors.length)],
        a: 0.65,
      });
    }
  }, []);

  /* ---------------------------------------------------------- */
  /* the activation sequence — guarded against re-triggering     */
  /* ---------------------------------------------------------- */
  const activate = useCallback(() => {
    const s = sim.current;
    if (s.phase !== "idle") return;

    if (reducedRef.current) {
      s.phase = "ready";
      goPhase("ready");
      onOpenRef.current();
      return;
    }

    const sched = (ms: number, fn: () => void) => {
      s.timeouts.push(window.setTimeout(fn, ms));
    };

    s.phase = "activating";
    goPhase("activating");

    sched(T_ACT, () => {
      s.phase = "converging";
      s.convT0 = performance.now();
      goPhase("converging");
    });
    sched(T_ACT + T_CONV, () => {
      s.phase = "synced";
      s.syncT0 = performance.now();
      goPhase("synced");
    });
    sched(T_REVEAL, () => {
      s.phase = "reveal";
      s.revT0 = performance.now();
      goPhase("reveal");
      setBurst(true);
      spawnBurst();
    });
    sched(T_OPEN, () => onOpenRef.current());
    sched(T_READY, () => {
      s.phase = "ready";
      s.reformT0 = performance.now();
      goPhase("ready");
      setPopped(true);
      /* the loop eases the orbs back out to their rings */
    });
  }, [spawnBurst, goPhase]);

  /* ---------------------------------------------------------- */
  /* lifecycle                                                   */
  /* ---------------------------------------------------------- */
  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    let fontsTimer = 0;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => measure()).catch(() => {});
    }
    fontsTimer = window.setTimeout(measure, 900);

    let loopStarted = false;
    if (!reducedRef.current) {
      sim.current.raf = requestAnimationFrame(loop);
      loopStarted = true;
    }

    const s = sim.current;
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.clearTimeout(fontsTimer);
      if (loopStarted) cancelAnimationFrame(s.raf);
      s.timeouts.forEach((id) => window.clearTimeout(id));
      s.timeouts = [];
    };
  }, [measure, loop]);

  const stageClass = [
    "gateway-stage",
    `is-${phase}`,
    phase === "ready" ? "is-gone" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const orbWrapClass = [
    "invoker-orbs",
    phase === "activating" ? "surge" : "",
    phase === "converging" || phase === "synced" ? "flying" : "",
    phase === "reveal" ? "flying merge" : "",
    phase === "ready" ? "settled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Fragment>
      <canvas ref={canvasRef} className="dust-canvas" aria-hidden="true" />

      {/* the sorcerer's three orbs — Quas, Wex, Exort */}
      <div className={orbWrapClass} aria-hidden="true">
        {ORB_DEFS.map((o, i) => (
          <div
            key={o.cls}
            ref={(el) => {
              orbEls.current[i] = el;
            }}
            className={`orb ${o.cls}${popped ? " pop" : ""}`}
          >
            <o.Glyph className="orb-glyph" size={26} />
          </div>
        ))}
      </div>

      <div ref={stageRef} className={stageClass}>
        <div className="stage-inner">
          <div className="orbit-field" ref={fieldRef}>
            {RADII_F.map((_, i) => (
              <div
                key={i}
                className="ring"
                ref={(el) => {
                  ringEls.current[i] = el;
                }}
              />
            ))}

            <div className="core-aura" aria-hidden="true" />
            <div className="core-float">
              <button
                type="button"
                className="core-btn"
                onClick={activate}
                aria-label={t("auth.enterAria")}
              >
                <span className="core-halo h1" aria-hidden="true" />
                <span className="core-halo h2" aria-hidden="true" />
                {phase !== "idle" && <span className="core-pulse" aria-hidden="true" />}
                <span className="core-inner">
                  <GemMark size={27} />
                  <span className="core-label">{t("auth.enter")}</span>
                </span>
              </button>
            </div>

            {burst && (
              <div className="burst" aria-hidden="true">
                <span className="bloom go" />
                <span className="ring-x go" />
                <span className="ring-x ring-g go" />
              </div>
            )}
          </div>

          <div className="gateway-caption">
            <p className="gateway-hint">{t("auth.gatewayHint")}</p>
          </div>
        </div>
        {burst && <span className="flash go" aria-hidden="true" />}
      </div>
    </Fragment>
  );
}
