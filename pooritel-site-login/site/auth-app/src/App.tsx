import React, { useEffect, useState } from "react";
import { I18nProvider, useI18n } from "./i18n";
import GatewayStage from "./components/GatewayStage";
import AuthCard, { type AuthCardProps } from "./components/AuthCard";
import LangDropdown from "./components/LangDropdown";
import ThemeToggle, { type Theme } from "./components/ThemeToggle";
import { GemMark } from "./components/icons";

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
      // Ignore storage errors in private mode.
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
      <div className={`bg-scene${heroState}`} aria-hidden="true" />
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
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
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

async function authRequest(path: string, payload: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: { success?: boolean; error?: string } = {};
  try {
    data = await response.json();
  } catch {
    // Keep HTTP status as fallback.
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Authentication request failed.");
  }

  return data;
}

export default function App() {
  const handleAuth: AuthCardProps["onAuth"] = async (payload) => {
    if (payload.method !== "email" || !payload.email || !payload.password) {
      throw new Error("Phone OTP is not enabled yet. Use Email + Password for now.");
    }

    await authRequest(
      payload.mode === "register" ? "/api/auth/register" : "/api/auth/login",
      {
        email: payload.email,
        password: payload.password,
      }
    );

    window.setTimeout(() => window.location.assign("/dashboard/"), 250);
  };

  const handleSocial: AuthCardProps["onSocial"] = async () => {
    throw new Error("This sign-in method will be enabled in the next auth phase.");
  };

  const handleSendCode: AuthCardProps["onSendCode"] = async () => {
    throw new Error("Phone OTP will be enabled in the next auth phase.");
  };

  return (
    <I18nProvider>
      <AuthGateway
        onAuth={handleAuth}
        onSocial={handleSocial}
        onSendCode={handleSendCode}
      />
    </I18nProvider>
  );
}
