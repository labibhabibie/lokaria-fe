import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { SmartLink } from "./SmartLink";

export type ButtonVariant = "olive" | "beige" | "ivory" | "outline-light" | "black";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, { base: string; hover: string }> = {
  olive: { base: "bg-olive text-white border-[#f5f2ec38]", hover: "hover:bg-brown" },
  beige: { base: "bg-beige text-ink border-[#f5f2ec38]", hover: "hover:bg-brown hover:text-white" },
  ivory: { base: "bg-ivory text-ink border-[#ffffff94]", hover: "hover:bg-beige" },
  "outline-light": { base: "bg-transparent text-white border-[#ffffff99]", hover: "hover:bg-[#ffffff26]" },
  black: { base: "bg-ink text-white border-[#f5f2ec38]", hover: "hover:bg-olive" },
};

const SIZE: Record<ButtonSize, string> = {
  sm: "min-h-10 px-[15px] text-[12px]",
  md: "min-h-[46px] px-5 text-[12px]",
  lg: "min-h-14 px-7 text-[13px]",
};

type Props = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
};

export function Button({ variant = "olive", size = "md", href, type = "button", disabled, fullWidth, onClick, className, children }: Props) {
  const v = VARIANT[variant];
  const classes = cx(
    "group relative isolate overflow-hidden items-center justify-center rounded-full border font-sans font-extrabold tracking-button uppercase whitespace-nowrap no-underline",
    "transition-[translate,scale,box-shadow,background-color,color] duration-300",
    fullWidth ? "flex w-full" : "inline-flex",
    SIZE[size],
    v.base,
    variant !== "outline-light" && "shadow-button",
    disabled
      ? "cursor-not-allowed opacity-45"
      : cx("cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97]", v.hover, variant !== "outline-light" && "hover:shadow-button-hover"),
    className,
  );
  const sheen = (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0 -z-10 -translate-x-[120%] bg-[linear-gradient(110deg,#0000_18%,#ffffff2e_50%,#0000_82%)] transition-transform duration-[650ms]",
        !disabled && "group-hover:translate-x-[120%]",
      )}
    />
  );
  if (href && !disabled) {
    return (
      <SmartLink href={href} onClick={onClick} className={classes}>
        {sheen}
        {children}
      </SmartLink>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {sheen}
      {children}
    </button>
  );
}
