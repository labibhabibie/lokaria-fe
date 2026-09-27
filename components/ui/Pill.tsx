import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type PillVariant = "glass" | "ivory" | "popular" | "outline" | "olive" | "tint";

const VARIANT: Record<PillVariant, string> = {
  glass: "rounded-full bg-[#11111185] text-white border-[#fff6] backdrop-blur-[10px]",
  ivory: "rounded-full bg-[#f5f2ece6] text-ink border-transparent",
  popular: "rounded-none bg-brown text-white border-transparent",
  outline: "rounded-full bg-transparent text-ink border-[#11111147]",
  olive: "rounded-full bg-olive text-white border-olive",
  tint: "rounded-full bg-[#535b401f] text-olive border-transparent",
};

type Props = { variant?: PillVariant; className?: string; children: ReactNode };

export function Pill({ variant = "outline", className, children }: Props) {
  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1.5 border px-3.5 py-1.5 font-sans text-[11px] font-extrabold tracking-label whitespace-nowrap uppercase transition-all duration-[250ms]",
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
