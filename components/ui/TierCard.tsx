import { cx } from "@/lib/cx";
import { SmartLink } from "./SmartLink";

export type TierTone = "silver" | "gold" | "black" | "ivory" | "beige";

const TONE: Record<TierTone, { card: string; muted: string; line: string }> = {
  silver: { card: "bg-tier-silver text-ivory", muted: "text-[#f5f2ecad]", line: "border-[#f5f2ec33]" },
  gold: { card: "bg-tier-gold text-ivory", muted: "text-[#f5f2ecad]", line: "border-[#f5f2ec33]" },
  black: { card: "bg-ink text-ivory", muted: "text-[#f5f2ecad]", line: "border-[#f5f2ec33]" },
  ivory: { card: "bg-ivory text-ink", muted: "text-[#77736c]", line: "border-[#1111111a]" },
  beige: { card: "bg-beige text-ink", muted: "text-[#11111199]", line: "border-[#1111111a]" },
};

type Props = {
  tone?: TierTone;
  index: string;
  name: string;
  note?: string;
  price: string;
  period?: string;
  credits?: string;
  features?: string[];
  /** Badge text; omit for a regular tier. */
  popular?: string;
  cta?: string;
  href: string;
  className?: string;
};

export function TierCard({ tone = "ivory", index, name, note, price, period = "/ 30 hari", credits, features = [], popular, cta = "Pilih Tingkat →", href, className }: Props) {
  const t = TONE[tone];
  return (
    <div
      className={cx(
        "relative flex flex-col justify-between border p-8 font-sans transition-all duration-[400ms] hover:-translate-y-2.5 hover:shadow-lift",
        popular ? "min-h-[680px] mobile:min-h-[620px]" : "min-h-[620px]",
        t.card,
        t.line,
        className,
      )}
    >
      {popular && (
        <span className={cx("absolute top-6 right-6 border bg-ivory px-[11px] py-2 text-[11px] tracking-label text-ink uppercase", t.line)}>
          {popular}
        </span>
      )}
      <div>
        <div className={cx("text-[11px] tracking-[.15em] uppercase", t.muted)}>{index}</div>
        <h3 className="mt-20 mb-1 text-[46px] font-bold tracking-[-.06em] uppercase">{name}</h3>
        {note && <p className={cx("m-0 font-serif text-[18px] italic", t.muted)}>{note}</p>}
        <div className="mt-9 mb-3 flex items-end gap-2">
          <b className="text-[25px] tracking-[-.05em]">{price}</b>
          <span className={cx("mb-[5px] text-[12px] uppercase", t.muted)}>{period}</span>
        </div>
        {credits && (
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-lg bg-[#535b401f] px-3 py-1.5 text-[12px] font-bold">{credits}</div>
        )}
      </div>
      <div>
        <ul className={cx("m-0 list-none border-t p-0", t.line)}>
          {features.map((f) => (
            <li key={f} className={cx("flex gap-3 border-b py-3 text-[13.5px]", t.line)}>
              {f}
            </li>
          ))}
        </ul>
        <SmartLink
          href={href}
          className={cx("mt-6 flex justify-between border-t pt-[18px] text-[12px] font-extrabold tracking-[.1em] text-inherit uppercase no-underline", t.line)}
        >
          {cta}
        </SmartLink>
      </div>
    </div>
  );
}
