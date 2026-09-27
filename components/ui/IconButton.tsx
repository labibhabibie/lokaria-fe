import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Props = {
  label: string;
  variant?: "outline" | "glass";
  /** Diameter in px (default 38). */
  size?: number;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
};

export function IconButton({ label, variant = "outline", size = 38, onClick, className, children }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      className={cx(
        "grid cursor-pointer place-items-center rounded-full border font-sans leading-none transition-all duration-300",
        variant === "glass"
          ? "border-[#ffffff40] bg-[#ffffff2e] text-white backdrop-blur-[10px] hover:bg-[#fff6]"
          : "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}
