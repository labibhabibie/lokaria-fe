import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: ReactNode;
  open?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export function FieldTrigger({ label, value, placeholder = "Pilih", icon, open, disabled, onClick, className }: Props) {
  const has = value != null && value !== "";
  return (
    <button
      type="button"
      disabled={disabled}
      aria-expanded={open}
      aria-haspopup="listbox"
      onClick={onClick}
      className={cx(
        "grid min-h-[54px] w-full items-center gap-[11px] rounded-field border bg-white px-3.5 text-left font-sans text-ink transition-[border-color,box-shadow,background-color] duration-200",
        icon ? "grid-cols-[20px_minmax(0,1fr)_auto]" : "grid-cols-[minmax(0,1fr)_auto]",
        open ? "border-olive shadow-[0_0_0_3px_#535b401c]" : "border-[#1111112e] hover:border-[#535b408c] hover:bg-[#fdfcf9]",
        disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer",
        className,
      )}
    >
      {icon && <span className="grid place-items-center text-olive">{icon}</span>}
      <span className="flex min-w-0 flex-col gap-0.5">
        <small className="text-[8px] leading-none font-extrabold tracking-[.1em] text-[#1111117a] uppercase">{label}</small>
        <b className={cx("truncate text-[13px] leading-[1.25]", has ? "font-bold text-ink" : "font-medium text-[#11111161]")}>
          {has ? value : placeholder}
        </b>
      </span>
      <i className={cx("text-[16px] text-[#11111173] not-italic transition-transform duration-200", open && "rotate-180")}>⌄</i>
    </button>
  );
}
