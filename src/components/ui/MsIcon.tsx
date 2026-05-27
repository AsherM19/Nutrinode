"use client";

type MsIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

export function MsIcon({ name, className, filled }: MsIconProps) {
  return (
    <span
      className={["material-symbols-outlined shrink-0 leading-none", className].filter(Boolean).join(" ")}
      data-fill={filled ? "1" : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}
