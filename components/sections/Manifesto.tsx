import { manifesto } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Manifesto() {
  const { before, accent, after } = manifesto.statement;
  return (
    <section className="bg-olive px-[max(5vw,64px)] py-[150px] text-white tablet:px-[42px] tablet:py-[100px] mobile:px-[18px] mobile:py-[82px]">
      <Eyebrow light>{manifesto.eyebrow}</Eyebrow>
      <Reveal className="mt-[70px] mb-[110px] text-[clamp(42px,5vw,76px)] leading-[1.08] tracking-[-.05em] uppercase mobile:mt-12 mobile:mb-16 mobile:text-[34px]">
        {before} <em className="font-serif font-medium text-beige">{accent}</em> {after}
      </Reveal>
      <div className="flex flex-wrap justify-end gap-20 border-t border-[#fff3] pt-[22px] text-[12px] tracking-[.14em] text-[#ffffff9e] uppercase mobile:justify-start mobile:gap-x-8 mobile:gap-y-3">
        {manifesto.meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </section>
  );
}
