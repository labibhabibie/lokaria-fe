import { cx } from "@/lib/cx";
import { SmartLink } from "./SmartLink";

type Props = { day: string; month: string; type: string; title: string; tagline: string; href: string; className?: string };

export function EventRow({ day, month, type, title, tagline, href, className }: Props) {
  return (
    <SmartLink
      href={href}
      className={cx(
        "group grid grid-cols-[84px_96px_minmax(0,1.5fr)_minmax(0,1.2fr)_38px] items-center gap-x-7 border-t border-[#11111133] py-[26px] font-sans text-inherit no-underline transition-all duration-300 hover:bg-[#f5f2ec59] hover:pl-3.5",
        "tablet:grid-cols-[84px_96px_minmax(0,1fr)_38px]",
        "mobile:grid-cols-[auto_minmax(0,1fr)_38px] mobile:gap-x-4 mobile:gap-y-3",
        className,
      )}
    >
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <b className="text-[34px] leading-none tracking-[-.04em]">{day}</b>
        <span className="text-[11.5px] font-extrabold tracking-label text-[#11111199] uppercase">{month}</span>
      </div>
      <div className="inline-flex w-fit rounded-[30px] border border-[#11111147] px-3.5 py-1.5 text-[11px] font-extrabold tracking-label uppercase transition-all duration-[250ms] group-hover:border-olive group-hover:bg-olive group-hover:text-white">
        {type}
      </div>
      <div className="contents tablet:flex tablet:flex-col tablet:gap-1.5 mobile:col-span-3 mobile:row-start-2">
        <h3 className="m-0 text-[18px] leading-[1.35] font-bold tracking-[-.02em] uppercase transition-colors duration-[250ms] group-hover:text-olive">{title}</h3>
        <p className="m-0 text-[13.5px] leading-[1.55] text-[#111111ad]">{tagline}</p>
      </div>
      <span className="grid size-[38px] place-items-center justify-self-end rounded-full border border-ink text-[15px] transition-all duration-300 group-hover:bg-ink group-hover:text-white mobile:col-start-3 mobile:row-start-1">
        →
      </span>
    </SmartLink>
  );
}
