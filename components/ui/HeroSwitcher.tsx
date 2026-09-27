import { cx } from "@/lib/cx";

type Props = { items: string[]; active: number; onChange: (index: number) => void; className?: string };

export function HeroSwitcher({ items, active, onChange, className }: Props) {
  return (
    <div className={cx("flex gap-6 font-sans", className)} role="tablist">
      {items.map((item, i) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={i === active}
          onClick={() => onChange(i)}
          className={cx(
            "cursor-pointer border-b-2 bg-transparent pb-2 text-[12px] uppercase transition-all duration-300",
            i === active ? "border-beige text-white" : "border-transparent text-[#ffffff8c] hover:text-white",
          )}
        >
          <span className="mr-2">{String(i + 1).padStart(2, "0")}</span>
          {item}
        </button>
      ))}
    </div>
  );
}
