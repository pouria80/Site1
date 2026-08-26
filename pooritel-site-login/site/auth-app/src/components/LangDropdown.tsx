import React, { useEffect, useRef, useState } from "react";
import { useI18n, type Lang } from "../i18n";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "./icons";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "fa", label: "فارسی" },
  { code: "en", label: "English" },
];

export default function LangDropdown() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = OPTIONS.find((o) => o.code === lang) ?? OPTIONS[0];

  return (
    <div className={`lang-dropdown${open ? " open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="lang-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("auth.language")}
      >
        <GlobeIcon size={16} className="globe" />
        <span className="num">{current.label}</span>
        <ChevronDownIcon size={14} className="chev" />
      </button>
      {open && (
        <div className="lang-menu" role="listbox" aria-label={t("auth.language")}>
          {OPTIONS.map((o) => (
            <button
              key={o.code}
              type="button"
              role="option"
              aria-checked={o.code === lang}
              className="lang-opt"
              onClick={() => {
                setLang(o.code);
                setOpen(false);
              }}
            >
              <span className="num">{o.label}</span>
              <CheckIcon size={13} className="tick" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
