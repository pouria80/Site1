import React from "react";

type IconProps = { size?: number; className?: string };

const base = (size?: number) => ({
  width: size ?? 18,
  height: size ?? 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** PooriTel brand mark — faceted diamond, gradient stroke. */
export function GemMark({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={1.6} aria-hidden="true">
      <defs>
        <linearGradient id="pt-gem-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#557449" />
          <stop offset="0.55" stopColor="#7d9f70" />
          <stop offset="1" stopColor="#0a9fac" />
        </linearGradient>
      </defs>
      <path d="M12 2.4 20.6 9 12 21.6 3.4 9 12 2.4Z" stroke="url(#pt-gem-grad)" />
      <path d="M3.4 9h17.2" stroke="url(#pt-gem-grad)" />
      <path d="M12 2.4 9 9l3 12.6L15 9l-3-6.6Z" stroke="url(#pt-gem-grad)" opacity="0.75" />
    </svg>
  );
}

/** Security pillar — shield. */
export function ShieldIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M12 2.8 5 5.4v5.2c0 4.6 3 8.4 7 10.6 4-2.2 7-6 7-10.6V5.4L12 2.8Z" />
      <path d="m9.2 11.6 2 2 3.8-4" />
    </svg>
  );
}

/** Speed / market pillar — bolt. */
export function BoltIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M13.2 2.6 5.4 13.4h5l-1.6 8 7.8-10.8h-5l1.6-8Z" />
    </svg>
  );
}

/** Trust / premium pillar — crown. */
export function CrownIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="m3.6 8 3.2 2.6L12 5l5.2 5.6L20.4 8l-1.4 9.4H5L3.6 8Z" />
      <path d="M5 20.4h14" />
    </svg>
  );
}

export function MailIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2.6" />
      <path d="m4.4 7.2 7.6 6 7.6-6" />
    </svg>
  );
}

export function PhoneIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <rect x="7" y="2.8" width="10" height="18.4" rx="2.6" />
      <path d="M10.4 18.2h3.2" />
    </svg>
  );
}

export function LockIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <rect x="4.8" y="10.4" width="14.4" height="10" rx="2.6" />
      <path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8" />
    </svg>
  );
}

export function EyeIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

export function EyeOffIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M4.5 4.5l15 15" />
      <path d="M9.9 6.3A9.8 9.8 0 0 1 12 5.8c5.8 0 9.2 6.2 9.2 6.2a17 17 0 0 1-3.3 3.9M6.1 8.4A16.6 16.6 0 0 0 2.8 12S6.2 18.2 12 18.2a9.4 9.4 0 0 0 3.9-.9" />
      <path d="M9.5 9.8a2.7 2.7 0 0 0 3.8 3.8" />
    </svg>
  );
}

/** Gaming pillar — controller. */
export function GamepadIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M6.9 7.4h10.2a4.7 4.7 0 0 1 4.6 5.6l-.7 3.5a2.9 2.9 0 0 1-5 1.4L14.5 16H9.5L8 17.9a2.9 2.9 0 0 1-5-1.4l-.7-3.5a4.7 4.7 0 0 1 4.6-5.6Z" />
      <path d="M8 10.3v3M6.5 11.8h3" />
      <circle cx="15.3" cy="10.9" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="12.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GlobeIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2M12 3.4c2.5 2.3 3.8 5.3 3.8 8.6s-1.3 6.3-3.8 8.6c-2.5-2.3-3.8-5.3-3.8-8.6s1.3-6.3 3.8-8.6Z" />
    </svg>
  );
}

export function ChevronDownIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </svg>
  );
}

export function CheckIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={2.2} aria-hidden="true">
      <path d="m5 12.8 4.4 4.4L19 7.4" />
    </svg>
  );
}

export function AlertIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={1.9} aria-hidden="true">
      <path d="M12 3.6 2.8 19.4h18.4L12 3.6Z" />
      <path d="M12 9.6v4.6" />
      <circle cx="12" cy="16.8" r="0.4" fill="currentColor" />
    </svg>
  );
}

export function TelegramIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size ?? 18}
      height={size ?? 18}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M21.94 4.04c.3-1.05-.74-1.9-1.7-1.5L2.66 9.72c-1.06.44-1.02 1.94.06 2.32l4.53 1.58 1.72 5.36c.33 1.03 1.65 1.27 2.32.42l2.05-2.6 4.13 3.03c.85.62 2.05.18 2.3-.86l2.17-14.93ZM8.42 13.1l8.86-5.75c.4-.26.82.28.46.61l-7.26 6.62-.28 3.1-1.78-4.58Z"
      />
    </svg>
  );
}

export function SteamIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.8" />
      <circle cx="15.7" cy="8.6" r="2.6" />
      <circle cx="15.7" cy="8.6" r="1.15" />
      <path d="m13.6 10.8-4.3 3.1" />
      <circle cx="7.8" cy="15" r="2.1" />
      <circle cx="7.8" cy="15" r="0.9" />
    </svg>
  );
}

export function GoogleIcon({ size, className }: IconProps) {
  const s = size ?? 18;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5.04c1.7 0 3.23.59 4.43 1.74l3.29-3.29C17.72 1.6 15.06.5 12 .5 7.4.5 3.44 3.12 1.5 6.96l3.84 2.98C6.26 7.1 8.9 5.04 12 5.04Z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62l3.72 2.89c2.17-2.01 3.72-4.97 3.72-8.7Z"
      />
      <path
        fill="#FBBC05"
        d="M5.34 14.06A7.2 7.2 0 0 1 4.96 12c0-.72.14-1.41.38-2.06L1.5 6.96A11.44 11.44 0 0 0 .5 12c0 1.86.44 3.6 1.24 5.15l3.6-3.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.06 0 5.63-1 7.51-2.72l-3.72-2.89c-1.02.69-2.33 1.1-3.79 1.1-3.1 0-5.74-2.06-6.66-4.9l-3.6 3.09C3.68 20.88 7.6 23.5 12 23.5Z"
      />
    </svg>
  );
}
