import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import {
  AlertIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  GemMark,
  GoogleIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  SteamIcon,
  TelegramIcon,
} from "./icons";

export type Mode = "login" | "register";
export type Method = "email" | "phone";
export type AuthProvider = "telegram" | "steam" | "google";
type Status = "idle" | "loading" | "success";
type Errors = Partial<Record<"id" | "password" | "confirm" | "code", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s-]{8,15}$/;

/** داده‌ای که پس از اعتبارسنجی فرم به بک‌اند واقعی شما تحویل می‌شود */
export interface AuthPayload {
  mode: Mode;
  method: Method;
  email?: string;
  phone?: string;
  password?: string;
  code?: string;
}

export interface AuthCardProps {
  /** اتصال به بک‌اند — پس از اعتبارسنجی فرم صدا زده می‌شود.
   *  برای نمایش خطا کافی است یک Error پرتاب کنید (متن آن نمایش داده می‌شود).
   *  اگر پاس ندهید، کارت در حالت نمایشی (demo) کار می‌کند. */
  onAuth?: (payload: AuthPayload) => Promise<void>;
  /** ارسال کد تأیید پیامکی — اگر پاس ندهید، شبیه‌سازی می‌شود. */
  onSendCode?: (phone: string) => Promise<void>;
  /** ورود با تلگرام/استیم/گوگل — اگر پاس ندهید، شبیه‌سازی می‌شود. */
  onSocial?: (provider: AuthProvider) => Promise<void>;
}

export default function AuthCard({ onAuth, onSendCode, onSocial }: AuthCardProps) {
  const { t, dir } = useI18n();
  const [mode, setMode] = useState<Mode>("login");
  const [method, setMethod] = useState<Method>("email");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [shake, setShake] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [failMsg, setFailMsg] = useState<string | null>(null);

  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  /* OTP resend countdown */
  useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setErrors({});
    setFailMsg(null);
    setStatus("idle");
  };

  const switchMethod = (m: Method) => {
    if (m === method) return;
    setMethod(m);
    setErrors({});
    setFailMsg(null);
    setStatus("idle");
  };

  const fail = (errs: Errors) => {
    setErrors(errs);
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    later(() => setShake(false), 500);
  };

  const showFail = (err: unknown) => {
    setStatus("idle");
    setFailMsg(
      err instanceof Error && err.message ? err.message : t("auth.errGeneric")
    );
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    later(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || sending) return;

    const errs: Errors = {};
    if (method === "email") {
      if (!EMAIL_RE.test(email.trim())) errs.id = t("auth.errEmail");
    } else {
      if (!PHONE_RE.test(phone.trim())) errs.id = t("auth.errPhone");
      if (otpSent && !/^\d{6}$/.test(code.trim())) errs.code = t("auth.errCode");
    }
    if (method === "email") {
      if (password.length < 6) errs.password = t("auth.errPassword");
      if (mode === "register" && confirm !== password) errs.confirm = t("auth.errConfirm");
    }

    if (Object.keys(errs).length) {
      fail(errs);
      return;
    }
    setErrors({});
    setStatus("loading");

    if (onAuth) {
      /* real backend — wired by the host project */
      try {
        await onAuth({
          mode,
          method,
          email: method === "email" ? email.trim() : undefined,
          phone: method === "phone" ? phone.trim() : undefined,
          password: method === "email" ? password : undefined,
          code: method === "phone" && otpSent ? code.trim() : undefined,
        });
        setFailMsg(null);
        setStatus("success");
        later(() => setStatus("idle"), 2800);
      } catch (err) {
        showFail(err);
      }
      return;
    }

    /* demo mode — no backend connected */
    later(() => {
      setStatus("success");
      later(() => setStatus("idle"), 2800);
    }, 950);
  };

  const handleSendCode = async () => {
    if (!PHONE_RE.test(phone.trim())) {
      fail({ id: t("auth.errPhone") });
      return;
    }
    if (onSendCode) {
      setSending(true);
      try {
        await onSendCode(phone.trim());
        setErrors({});
        setFailMsg(null);
        setOtpSent(true);
        setCountdown(30);
      } catch (err) {
        setFailMsg(
          err instanceof Error && err.message ? err.message : t("auth.errGeneric")
        );
      } finally {
        setSending(false);
      }
      return;
    }
    setErrors({});
    setOtpSent(true);
    setCountdown(30);
  };

  const handleSocial = async (provider: AuthProvider) => {
    if (status === "loading") return;
    if (onSocial) {
      setStatus("loading");
      try {
        await onSocial(provider);
        setFailMsg(null);
        setStatus("success");
        later(() => setStatus("idle"), 2800);
      } catch (err) {
        showFail(err);
      }
      return;
    }
    setStatus("loading");
    later(() => {
      setStatus("success");
      later(() => setStatus("idle"), 2800);
    }, 800);
  };

  const dirSign = dir === "rtl" ? -1 : 1;
  const lineOrigin = dir === "rtl" ? "100% 50%" : "0% 50%";
  const indicatorShift =
    mode === "login" ? "translateX(0)" : `translateX(${dirSign * 100}%)`;

  const idLabel = method === "email" ? t("auth.emailLabel") : t("auth.phoneLabel");
  const idKey: "id" = "id";

  const fieldCls = (key: keyof Errors, focused: string) =>
    [
      "field",
      errors[key] ? "has-error" : "",
      focusedField === focused ? "focused" : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="card-anim">
      <div className="auth-card">
        {/* HUD corner brackets */}
        <span className="hud hud-c1" aria-hidden="true" />
        <span className="hud hud-c2" aria-hidden="true" />
        <span className="hud hud-c3" aria-hidden="true" />
        <span className="hud hud-c4" aria-hidden="true" />

        {/* HUD status strip */}
        <div className="hud-status" aria-hidden="true">
          <span className="d d-c" />
          <span className="d d-s" />
          <span className="d d-g" />
          <span className="lbl">
            <span className="num">PT-GATEWAY</span>
            <span className="live" />
          </span>
        </div>

        <div className="card-head">
          <span className="mini-core" aria-hidden="true">
            <span>
              <GemMark size={19} />
            </span>
          </span>
          <h1 className="card-title">{t("auth.gatewayTitle")}</h1>
        </div>

        <div className="tabs" role="tablist" aria-label={t("auth.gatewayTitle")}>
          <span className="tab-ind" style={{ transform: indicatorShift }} aria-hidden="true" />
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`tab-btn${mode === "login" ? " active" : ""}`}
            onClick={() => switchMode("login")}
          >
            {t("auth.loginTab")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={`tab-btn${mode === "register" ? " active" : ""}`}
            onClick={() => switchMode("register")}
          >
            {t("auth.registerTab")}
          </button>
        </div>

        <div className="methods">
          <button
            type="button"
            className={`method-btn${method === "email" ? " active" : ""}`}
            onClick={() => switchMethod("email")}
            aria-pressed={method === "email"}
          >
            <MailIcon />
            {t("auth.methodEmail")}
          </button>
          <button
            type="button"
            className={`method-btn${method === "phone" ? " active" : ""}`}
            onClick={() => switchMethod("phone")}
            aria-pressed={method === "phone"}
          >
            <PhoneIcon />
            {t("auth.methodPhone")}
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className={shake ? "shake" : undefined}>
          {failMsg && (
            <div className="fail-banner" role="alert">
              <AlertIcon size={15} />
              {failMsg}
            </div>
          )}
          {status === "success" && (
            <div className="success-banner" role="status">
              <CheckIcon size={15} />
              {t("auth.demoSuccess")}
            </div>
          )}

          {/* identifier: email or phone */}
          <div className={fieldCls(idKey, "id")}>
            <label htmlFor="auth-id">{idLabel}</label>
            <div className="control">
              {method === "email" ? (
                <input
                  id="auth-id"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  dir="ltr"
                  style={{ textAlign: dir === "rtl" ? "right" : "left" }}
                  placeholder={t("auth.emailPh")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("id")}
                  onBlur={() => setFocusedField(null)}
                />
              ) : (
                <div className="phone-row">
                  <input
                    id="auth-id"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    style={{ textAlign: "left" }}
                    placeholder={t("auth.phonePh")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setFocusedField("id")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    className="send-btn num"
                    onClick={handleSendCode}
                    disabled={sending || (otpSent && countdown > 0)}
                  >
                    {sending
                      ? t("auth.sendingCode")
                      : otpSent && countdown > 0
                        ? t("auth.resendIn", { s: countdown })
                        : otpSent
                          ? t("auth.resend")
                          : t("auth.sendCode")}
                  </button>
                </div>
              )}
              <span className="field-line" style={{ transformOrigin: lineOrigin }} />
            </div>
            {errors.id && <p className="field-err">{errors.id}</p>}
          </div>

          {/* OTP code */}
          {method === "phone" && otpSent && (
            <>
              <p className="otp-hint">{t("auth.otpHint")}</p>
              <div className={fieldCls("code", "code")}>
                <label htmlFor="auth-code">{t("auth.codeLabel")}</label>
                <div className="control">
                  <input
                    id="auth-code"
                    className="code-input num"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder={t("auth.codePh")}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    onFocus={() => setFocusedField("code")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <span className="field-line" style={{ transformOrigin: lineOrigin }} />
                </div>
                {errors.code && <p className="field-err">{errors.code}</p>}
              </div>
            </>
          )}

          {/* password — email method only; phone accounts use the OTP code alone */}
          {method === "email" && (
          <div className={fieldCls("password", "password")}>
            <label htmlFor="auth-pass">{t("auth.passwordLabel")}</label>
            <div className="control">
              <input
                id="auth-pass"
                className="has-eye"
                type={showPass ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                dir="ltr"
                style={{ textAlign: "left" }}
                placeholder={t("auth.passwordPh")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? t("auth.hidePass") : t("auth.showPass")}
              >
                {showPass ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
              </button>
              <span className="field-line" style={{ transformOrigin: lineOrigin }} />
            </div>
            {errors.password && <p className="field-err">{errors.password}</p>}
          </div>
          )}

          {/* confirm (email register only) */}
          {method === "email" && mode === "register" && (
            <div className={fieldCls("confirm", "confirm")}>
              <label htmlFor="auth-confirm">{t("auth.confirmLabel")}</label>
              <div className="control">
                <input
                  id="auth-confirm"
                  className="has-eye"
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  dir="ltr"
                  style={{ textAlign: "left" }}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onFocus={() => setFocusedField("confirm")}
                  onBlur={() => setFocusedField(null)}
                />
                <span className="field-line" style={{ transformOrigin: lineOrigin }} />
              </div>
              {errors.confirm && <p className="field-err">{errors.confirm}</p>}
            </div>
          )}

          {mode === "login" && method === "email" && (
            <div className="forgot-row">
              <button type="button" className="link-btn">
                {t("auth.forgot")}
              </button>
            </div>
          )}

          <button
            type="submit"
            className={`submit${status === "loading" ? " is-loading" : ""}`}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span className="spin" aria-hidden="true" />
                {t("auth.loading")}
              </>
            ) : mode === "login" ? (
              t("auth.loginBtn")
            ) : (
              t("auth.registerBtn")
            )}
          </button>
        </form>

        <div className="divider">{t("auth.orContinue")}</div>

        <div className="socials">
          <button type="button" className="social-btn s-telegram" onClick={() => handleSocial("telegram")}>
            <TelegramIcon size={17} />
            <span>{t("auth.telegram")}</span>
          </button>
          <button type="button" className="social-btn s-steam" onClick={() => handleSocial("steam")}>
            <SteamIcon size={17} />
            <span>{t("auth.steam")}</span>
          </button>
          <button type="button" className="social-btn s-google" onClick={() => handleSocial("google")}>
            <GoogleIcon size={16} />
            <span>{t("auth.google")}</span>
          </button>
        </div>

        <div className="legal">
          <p>
            {t("auth.termsPre")}
            <a href="#terms" onClick={(e) => e.preventDefault()}>
              {t("auth.termsLink")}
            </a>
            {t("auth.termsPost")}
          </p>
          <p className="demo-note">
            <LockIcon size={12} className="lock-inline" /> {t("auth.demoNote")}
          </p>
        </div>

        <div className="card-foot">
          {mode === "login" ? (
            <>
              {t("auth.noAccount")}{" "}
              <button type="button" className="switch-btn" onClick={() => switchMode("register")}>
                {t("auth.switchToRegister")}
              </button>
            </>
          ) : (
            <>
              {t("auth.hasAccount")}{" "}
              <button type="button" className="switch-btn" onClick={() => switchMode("login")}>
                {t("auth.switchToLogin")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
