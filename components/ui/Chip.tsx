import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Props = { light?: boolean; className?: string; children: ReactNode };

export function Chip({ light, className, children }: Props) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-[30px] border px-3 py-2.5 font-sans text-[12px] tracking-label uppercase",
        light ? "border-[#ffffff33] text-white" : "border-line text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
