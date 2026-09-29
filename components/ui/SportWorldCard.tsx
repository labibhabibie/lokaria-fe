import Image from "next/image";
import { cx } from "@/lib/cx";
import { SmartLink } from "./SmartLink";

type Props = {
  index: string;
  code: string;
  title: string;
  description?: string;
  price: string;
  image: { src: string; alt: string };
  /** Tailwind background class for the topline dot, e.g. "bg-cat-padel". */
  accentClassName?: string;
  detailsHref: string;
  detailsLabel?: string;
  bookHref: string;
  bookLabel?: string;
  sizes?: string;
  className?: string;
};

const pill =
  "inline-flex min-h-[38px] items-center justify-center rounded-full border px-4 text-[10px] font-extrabold tracking-[.12em] whitespace-nowrap uppercase no-underline transition-[background-color,border-color,color,translate] duration-[250ms] hover:-translate-y-0.5";

export function SportWorldCard({
  index,
  code,
  title,
  description,
  price,
  image,
  accentClassName = "bg-beige",
  detailsHref,
  detailsLabel = "Lihat detail",
  bookHref,
  bookLabel = "Pesan sekarang",
  sizes = "(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 58vw",
  className,
}: Props) {
  return (
    <article
      className={cx("group relative isolate flex min-h-[480px] overflow-hidden rounded-card font-sans text-white shadow-card", className)}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="-z-20 object-cover saturate-[.82] contrast-[1.04] [transition:scale_.85s_cubic-bezier(.2,.72,.2,1),filter_.5s] group-hover:scale-[1.045] group-hover:saturate-100 group-hover:contrast-[1.06]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(#1111117a_0%,#1111110a_42%,#111111e6_100%),linear-gradient(110deg,#11111142,#0000_58%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 z-[3] rounded-[20px] border border-[#fff3] transition-[border-color,inset] duration-[350ms] group-hover:inset-3.5 group-hover:border-[#ffffff6b]"
      />
      <div className="absolute top-[31px] right-[31px] left-[31px] z-[2] flex items-center justify-between text-micro font-extrabold tracking-[.17em] uppercase">
        <span className="inline-flex items-center gap-2.5">
          <span className={cx("size-2 rounded-full shadow-[0_0_0_5px_#ffffff21]", accentClassName)} />
          {index}
        </span>
        <span>{code}</span>
      </div>
      <div className="relative z-[2] w-full self-end px-10 py-[38px] mobile:px-7 mobile:py-8">
        {description && (
          <p className="mb-3 max-w-[500px] font-serif text-[15px] leading-[1.45] text-[#ffffffb3] italic">{description}</p>
        )}
        <h3 className="m-0 text-display-sm font-bold uppercase">{title}</h3>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-6 border-t border-[#ffffff3d] pt-[18px]">
          <span className="text-[10px] font-[650] tracking-[.06em] text-[#ffffffab] uppercase">{price}</span>
          <div className="inline-flex gap-[9px]">
            <SmartLink
              href={detailsHref}
              className={cx(pill, "border-[#ffffff57] bg-[#1111112e] text-white backdrop-blur-[8px] hover:border-[#ffffffb8] hover:bg-[#ffffff21]")}
            >
              {detailsLabel}
            </SmartLink>
            <SmartLink href={bookHref} className={cx(pill, "border-beige bg-beige text-ink hover:border-white hover:bg-white")}>
              {bookLabel}
            </SmartLink>
          </div>
        </div>
      </div>
    </article>
  );
}
