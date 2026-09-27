import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Props = { active?: boolean; count?: number; onClick?: () => void; className?: string; children: ReactNode };

export function FilterChip({ active, count, onClick, className, children }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-[18px] py-2 font-sans text-[11px] font-bold tracking-[.04em] backdrop-blur-[8px] transition-all duration-[250ms] ease-card",
        active
          ? "border-olive bg-olive text-white shadow-[0_6px_18px_#535b4040]"
          : "border-[#11111124] bg-[#ffffffb3] text-ink hover:-translate-y-px hover:border-olive hover:bg-white hover:shadow-[0_4px_12px_#1111110f]",
        className,
      )}
    >
      {children}
      {count != null && (
        <span
          className={cx(
            "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-[5px] text-[9px] font-extrabold",
            active ? "bg-[#ffffff40]" : "bg-[#11111114]",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
