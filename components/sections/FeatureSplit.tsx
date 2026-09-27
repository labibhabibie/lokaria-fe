import Image from "next/image";
import type { Feature } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cx } from "@/lib/cx";

export function FeatureSplit({ feature: f }: { feature: Feature }) {
  const photo = (
    <div className="relative min-h-[760px] overflow-hidden tablet:min-h-[520px] mobile:min-h-[400px]">
      <Image src={f.image.src} alt={f.image.alt} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover saturate-[.68]" />
      {f.imageLabel && (
        <div className="absolute top-1/2 right-[18px] rotate-180 text-[11px] tracking-[.2em] text-white uppercase [writing-mode:vertical-rl]">
          {f.imageLabel}
        </div>
      )}
      {f.stat && (
        <div className="absolute bottom-6 left-6 flex w-[200px] items-end justify-between gap-2.5 bg-beige p-5 text-ink">
          <b className="text-[36px] tracking-[-.08em]">{f.stat.value}</b>
          <span className="text-[11.5px] leading-normal uppercase">{f.stat.label}</span>
        </div>
      )}
    </div>
  );
  const copy = (
    <div className="flex flex-col items-start justify-center px-[clamp(50px,7vw,110px)] py-[100px] tablet:px-[42px] mobile:px-[18px] mobile:py-[82px]">
      <Reveal>
        <Eyebrow light={f.dark}>{f.eyebrow}</Eyebrow>
        <DisplayHeading size="md" light={f.dark} {...f.heading} />
        <p className={cx("my-9 max-w-[580px] text-[17px] leading-[1.8]", f.dark ? "text-[#ffffffa6]" : "text-inherit")}>{f.body}</p>
        {f.chips && (
          <div className="mb-10 flex flex-wrap gap-2">
            {f.chips.map((c) => (
              <Chip key={c} light={f.dark}>
                {c}
              </Chip>
            ))}
          </div>
        )}
        {f.list && (
          <div className="mb-10 grid w-full grid-cols-2 gap-x-5 mobile:grid-cols-1">
            {f.list.map((item) => (
              <span key={item} className="border-b border-[#ffffff26] py-3 text-[12.5px] tracking-[.1em] uppercase">
                {item}
              </span>
            ))}
          </div>
        )}
        <Button variant={f.dark ? "ivory" : "beige"} href={f.cta.href}>
          {f.cta.label}
        </Button>
      </Reveal>
    </div>
  );
  return (
    <section
      id={f.id}
      className={cx(
        "grid min-h-[820px] tablet:min-h-0 tablet:grid-cols-1",
        f.reverse ? "grid-cols-[.85fr_1.15fr]" : "grid-cols-[1.15fr_.85fr]",
        f.dark ? "bg-ink text-white" : "bg-ivory text-ink",
      )}
    >
      {f.reverse ? (
        <>
          {copy}
          {photo}
        </>
      ) : (
        <>
          {photo}
          {copy}
        </>
      )}
    </section>
  );
}
