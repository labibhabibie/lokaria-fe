import Image from "next/image";
import { brand, howItWorks as h } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatusDot } from "@/components/ui/StatusDot";
import { TextLink } from "@/components/ui/TextLink";
import { CopyPill } from "./CopyPill";

export function HowItWorks() {
  const s = h.support;
  return (
    <section
      id="how-it-works"
      className="section-pad relative overflow-hidden bg-[radial-gradient(circle_at_82%_14%,#c6ae9421,transparent_27%),linear-gradient(145deg,var(--color-olive-deep),var(--color-olive)_52%,var(--color-olive-darker))] text-ivory"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-.12em] -right-[3vw] text-[clamp(160px,23vw,360px)] leading-none font-extrabold tracking-[-.08em] text-[#f5f2ec09]"
      >
        {brand.wordmark}
      </div>
      <div className="relative mx-auto max-w-[1320px]">
        <Reveal className="mb-[60px] grid grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)] items-end gap-[clamp(36px,8vw,130px)] border-b border-[#f5f2ec2e] pb-11 tablet:grid-cols-1">
          <div>
            <Eyebrow light>{h.eyebrow}</Eyebrow>
            <h2 className="mt-[18px] font-serif text-[clamp(60px,7vw,104px)] leading-[.87] font-medium tracking-[-.055em] uppercase mobile:text-[48px]">
              {h.heading.before}{" "}
              <em className="text-beige italic">{h.heading.accent}</em>
            </h2>
          </div>
          <p className="m-0 font-serif text-[16px] leading-[1.65] text-[#f5f2ecad] italic">
            {h.aside}
          </p>
        </Reveal>
        <Reveal className="grid grid-cols-[minmax(0,1.42fr)_minmax(350px,.58fr)] gap-[18px] tablet:grid-cols-1">
          <div className="relative isolate flex min-h-[610px] flex-col justify-end overflow-hidden rounded-panel border border-[#f5f2ec29] p-[clamp(24px,3.5vw,50px)] pb-24 text-white shadow-panel mobile:min-h-[560px]">
            <Image
              src={h.image.src}
              alt={h.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="-z-20 object-cover saturate-[.68]"
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(#1111112e_0%,#11111166_40%,#111111e6_100%)]" />
            <ol className="m-0 list-none border-t border-[#ffffff33] p-0">
              {h.steps.map((step) => (
                <li
                  key={step.index}
                  className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-6 border-b border-[#ffffff33] py-6 mobile:grid-cols-[56px_minmax(0,1fr)] mobile:gap-4"
                >
                  <span className="font-serif text-[56px] leading-[.9] font-medium tracking-[-.05em] mobile:text-[40px]">
                    {step.index}
                  </span>
                  <div>
                    <div className="mb-2 text-[11px] font-extrabold tracking-[.15em] uppercase">
                      {step.title}
                    </div>
                    <p className="m-0 text-[14px] leading-[1.6] text-[#ffffffd1]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            {/* <div className="absolute bottom-6 left-6 inline-flex min-h-10 items-center gap-2.5 rounded-full border border-[#ffffff4d] bg-[#111111c7] px-4 text-[11px] font-extrabold tracking-[.13em] text-white uppercase backdrop-blur-[12px]">
              <StatusDot tone="live" pulse />
              {h.statusPill}
            </div> */}
          </div>
          <aside className="flex flex-col rounded-panel bg-ivory p-[clamp(30px,3.5vw,50px)] text-ink shadow-panel">
            <span className="text-[11px] font-extrabold tracking-[.17em] text-brown uppercase">
              {s.label}
            </span>
            <h3 className="mt-[18px] font-serif text-[clamp(38px,3.5vw,52px)] leading-[.97] font-medium tracking-[-.045em]">
              {s.title}
            </h3>
            <div className="mt-[34px] grid grid-cols-[minmax(0,1fr)_auto] gap-[13px] border-y border-[#11111121] py-[22px]">
              <div>
                <div className="mb-[7px] text-[10px] font-extrabold tracking-label text-[#11111173] uppercase">
                  Email
                </div>
                <a
                  href={`mailto:${s.email}`}
                  className="text-[13px] leading-[1.55] font-[650] text-ink no-underline"
                >
                  {s.email}
                </a>
              </div>
              <CopyPill
                text={s.email}
                label={s.copyLabel}
                copiedLabel={s.copiedLabel}
              />
            </div>
            {s.rows.map((row) => (
              <div
                key={row.label}
                className="border-b border-[#1111111a] py-[17px]"
              >
                <div className="mb-[7px] text-[10px] font-extrabold tracking-label text-[#11111173] uppercase">
                  {row.label}
                </div>
                <div className="text-[13px] leading-[1.55] text-[#111111c2]">
                  {row.value}
                </div>
              </div>
            ))}
            <div className="mt-auto flex flex-wrap items-center gap-5 pt-[30px]">
              <Button href={s.primary.href}>{s.primary.label}</Button>
              <TextLink href={s.secondary.href}>{s.secondary.label}</TextLink>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
