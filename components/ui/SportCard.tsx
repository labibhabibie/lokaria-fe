import Image from "next/image";
import { cx } from "@/lib/cx";
import { SmartLink } from "./SmartLink";

type Props = {
  index?: string;
  tag?: string;
  title: string;
  description?: string;
  price?: string;
  unit?: string;
  image: { src: string; alt: string };
  live?: string;
  href: string;
  detailsLabel?: string;
  bookHref: string;
  bookLabel?: string;
  className?: string;
};

export function SportCard({
  index,
  tag,
  title,
  description,
  price,
  unit = "/ hour",
  image,
  live,
  href,
  detailsLabel = "Details →",
  bookHref,
  bookLabel = "Book",
  className,
}: Props) {
  return (
    <div
      className={cx(
        "group flex h-full flex-col overflow-hidden rounded-listing border border-[#11111114] bg-white p-2.5 font-sans",
        "[transition:translate_.35s_cubic-bezier(.2,.7,.2,1),box-shadow_.35s,border-color_.35s] hover:-translate-y-1.5 hover:border-[#535b4059] hover:shadow-card-hover",
        className,
      )}
    >
      <div className="relative h-[220px] overflow-hidden rounded-photo bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 85vw, 400px"
          className="object-cover saturate-[.85] contrast-[1.02] [transition:scale_.7s_cubic-bezier(.2,.7,.2,1),filter_.45s] group-hover:scale-[1.06] group-hover:saturate-100 group-hover:contrast-[1.05]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(#00000052_0%,#0000_40%,#0009_100%)]" />
        {index && (
          <span className="absolute top-3 left-3 grid size-[34px] place-items-center rounded-full bg-[#f5f2ecf0] text-[11px] font-extrabold text-ink shadow-[0_4px_12px_#00000026] transition-all duration-300 group-hover:bg-beige">
            {index}
          </span>
        )}
        {tag && (
          <span className="absolute top-3 right-3 rounded-full border border-[#fff6] bg-[#11111185] px-[11px] py-[5px] text-micro font-extrabold tracking-label text-white uppercase backdrop-blur-[10px]">
            {tag}
          </span>
        )}
        {live && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#1111118c] px-[9px] py-1 text-micro font-bold tracking-[.05em] text-[#ffffffeb] uppercase backdrop-blur-[8px]">
            <span className="size-1.5 rounded-full bg-live shadow-[0_0_8px_#4ade80]" />
            {live}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-3.5 pb-1.5">
        <h3 className="mb-1.5 text-[19px] leading-[1.22] font-extrabold tracking-[-.03em] text-ink uppercase transition-colors duration-200 group-hover:text-olive">
          {title}
        </h3>
        {description && <p className="mb-2.5 font-serif text-[13.5px] leading-[1.45] text-[#5c5850] italic">{description}</p>}
        {price && (
          <span className="mb-3 inline-flex items-center gap-[5px] text-[11px] font-bold text-olive">
            {price}
            <span className="text-micro font-semibold tracking-[.05em] text-[#8c867a] uppercase">{unit}</span>
          </span>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#11111114] pt-3">
          <SmartLink href={href} className="text-[10px] font-extrabold tracking-button text-olive uppercase no-underline">
            {detailsLabel}
          </SmartLink>
          <SmartLink
            href={bookHref}
            className="rounded-full bg-olive px-4 py-[7px] text-[10px] font-extrabold tracking-button text-white uppercase no-underline shadow-[0_3px_10px_#535b4038]"
          >
            {bookLabel}
          </SmartLink>
        </div>
      </div>
    </div>
  );
}
