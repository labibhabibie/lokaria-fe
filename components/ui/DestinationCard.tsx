import Image from "next/image";
import { cx } from "@/lib/cx";
import { SmartLink } from "./SmartLink";

type Props = {
  /** Top-left pill label, e.g. "City 01". */
  label?: string;
  meta?: string;
  title: string;
  subtitle?: string;
  note?: string;
  image: { src: string; alt: string };
  href?: string;
  className?: string;
};

export function DestinationCard({ label, meta, title, subtitle, note, image, href, className }: Props) {
  const classes = cx("group relative isolate block h-[560px] overflow-hidden rounded-floor font-sans text-white no-underline mobile:h-[480px]", className);
  const body = (
    <>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 85vw, 50vw"
        className="object-cover [transition:scale_.8s_cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.045]"
      />
      <div className="absolute inset-0 z-[1] shade-floor" />
      {label && (
        <div className="absolute top-[18px] left-[18px] z-[2] rounded-full bg-[#f5f2ece6] px-3 py-[9px] text-[11.5px] font-extrabold tracking-label text-ink uppercase">
          {label}
        </div>
      )}
      <div className="absolute right-[30px] bottom-7 left-[30px] z-[2]">
        {meta && <small className="text-[11px] tracking-[.15em] text-beige uppercase">{meta}</small>}
        <h3 className="mt-2.5 mb-[5px] font-serif text-[clamp(34px,3.2vw,52px)] leading-[.95] font-medium tracking-[-.04em]">{title}</h3>
        {subtitle && <p className="mb-3.5 font-serif text-[23px] italic mobile:text-[19px]">{subtitle}</p>}
        {note && <span className="block max-w-[430px] text-[13px] leading-[1.65] text-[#ffffffad]">{note}</span>}
      </div>
    </>
  );
  return href ? (
    <SmartLink href={href} className={classes}>
      {body}
    </SmartLink>
  ) : (
    <div className={classes}>{body}</div>
  );
}
