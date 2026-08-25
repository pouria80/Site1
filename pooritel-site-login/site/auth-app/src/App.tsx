import React, { useEffect, useState } from "react";
import { I18nProvider, useI18n } from "./i18n";
import GatewayStage from "./components/GatewayStage";
import AuthCard, { type AuthCardProps } from "./components/AuthCard";
import LangDropdown from "./components/LangDropdown";
import ThemeToggle, { type Theme } from "./components/ThemeToggle";
import { GemMark } from "./components/icons";

/**
 * صفحهٔ کامل دروازهٔ ورود — قابل mount در هر روتر.
 * برای اتصال به بک‌اند واقعی، props مربوط به AuthCard را در این فایل پاس دهید.
 */
export function AuthGateway(authProps: AuthCardProps = {}) {
  const { t } = useI18n();
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<string>("idle");
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem("pt-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("pt-theme", theme);
    } catch {
      /* private mode — ignore */
    }
  }, [theme]);

  const heroState =
    phase === "activating" || phase === "converging" || phase === "synced"
      ? " channeling"
      : phase === "reveal" || phase === "ready"
        ? " settled"
        : "";

  return (
    <div className="app-shell">
      {/* one seamless arcane scene — sorcerer + arena, edge to edge */}
      <div className={`bg-scene${heroState}`} aria-hidden="true" />
      {/* soft ground fog over the scene floor */}
      <div className="ground-fog" aria-hidden="true" />
      <div className="bg-glow g-a" aria-hidden="true" />
      <div className="bg-glow g-b" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="/" aria-label="PooriTel Home">
          <span className="brand-mark" aria-hidden="true">
            <span>
              <GemMark size={20} />
            </span>
          </span>
          <span className="brand-text">
            <span className="brand-name">{t("auth.brandName")}</span>
            <span className="brand-tag">{t("auth.brandTag")}</span>
          </span>
        </a>
        <div className="header-actions">
          <LangDropdown />
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </div>
      </header>

      <main className="main-zone">
        <GatewayStage reduced={reduced} onOpen={() => setOpen(true)} onPhase={setPhase} />
        {open && (
          <div className="card-zone">
            <AuthCard {...authProps} />
          </div>
        )}
      </main>

      <div className={`veil${open ? " on" : ""}`} aria-hidden="true" />

      <footer className="site-foot">{t("auth.footer")}</footer>
    </div>
  );
}

export default function App() {
  const handleAuth: AuthCardProps["onAuth"] = async (payload) => {
    const identifier = payload.email || payload.phone || "member";
    const session = {
      authenticated: true,
      identifier,
      method: payload.method,
      mode: payload.mode,
      loginAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("pooritel_session", JSON.stringify(session));
    } catch {
      /* storage unavailable — navigation still works */
    }
    // Give the success animation a moment, then return to the marketplace home.
    window.setTimeout(() => window.location.assign("/"), 900);
  };

  const handleSocial: AuthCardProps["onSocial"] = async (provider) => {
    const session = {
      authenticated: true,
      provider,
      identifier: provider,
      mode: "login",
      loginAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("pooritel_session", JSON.stringify(session));
    } catch {
      /* storage unavailable — navigation still works */
    }
    window.setTimeout(() => window.location.assign("/"), 900);
  };

  return (
    <I18nProvider>
      <AuthGateway onAuth={handleAuth} onSocial={handleSocial} />
    </I18nProvider>
  );
}
