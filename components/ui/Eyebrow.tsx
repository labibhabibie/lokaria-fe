import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Props = { light?: boolean; className?: string; children: ReactNode };

export function Eyebrow({ light, className, children }: Props) {
  return (
    <p className={cx("mb-6 font-sans text-[12px] font-extrabold tracking-eyebrow uppercase", light ? "text-beige" : "text-olive", className)}>
      {children}
    </p>
  );
}
