import React from "react";
import { useI18n } from "../i18n";

export type Theme = "dark" | "light";

function SunIcon() {
  return (
    <svg
      className="icon-sun"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="icon-moon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 13.2A8.2 8.2 0 0 1 10.8 4a8.2 8.2 0 1 0 9.2 9.2Z" />
      <path d="m16.6 3.4.5 1.6 1.6.5-1.6.5-.5 1.6-.5-1.6-1.6-.5 1.6-.5.5-1.6Z" strokeWidth="1.2" />
    </svg>
  );
}

export default function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      className="theme-btn"
      onClick={onToggle}
      aria-label={t("auth.themeToggle")}
      aria-pressed={theme === "dark"}
      title={t("auth.themeToggle")}
    >
      <SunIcon />
      <MoonIcon />
    </button>
  );
}
