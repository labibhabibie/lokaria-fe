import { cx } from "@/lib/cx";

type Props = {
  tone?: "live" | "open" | "accent";
  /** Diameter in px (default 7). */
  size?: number;
  pulse?: boolean;
  className?: string;
};

const TONE = {
  live: "bg-live shadow-[0_0_8px_#4ade80]",
  open: "bg-[#d4e5a8] shadow-[0_0_0_4px_#ffffff21]",
  accent: "bg-beige shadow-[0_0_0_4px_#ffffff21]",
};

export function StatusDot({ tone = "live", size = 7, pulse, className }: Props) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cx("inline-block flex-none rounded-full", TONE[tone], pulse && "animate-pulse-live motion-reduce:animate-none", className)}
    />
  );
}
