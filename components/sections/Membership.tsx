import { membership as m, rupiah } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TierCard } from "@/components/ui/TierCard";

export function Membership() {
  return (
    <section id={m.id} className="section-pad bg-sand">
      <Reveal>
        <SectionHeading eyebrow={m.eyebrow} heading={m.heading} aside={m.sub} />
      </Reveal>
      <Reveal className="grid grid-cols-3 items-center gap-4 tablet:grid-cols-1 tablet:items-stretch mobile:no-scrollbar mobile:-mx-[18px] mobile:flex mobile:snap-x mobile:snap-mandatory mobile:items-center mobile:overflow-x-auto mobile:scroll-px-[18px] mobile:px-[18px] mobile:py-3">
        {m.tiers.map((t) => (
          <TierCard
            key={t.name}
            tone={t.tone}
            index={t.index}
            name={t.name}
            note={t.note}
            price={rupiah(t.price)}
            period={t.period}
            credits={t.credits}
            features={t.features}
            popular={t.popular}
            cta={m.cta.label}
            href={m.cta.href}
            className="mobile:w-[85vw] mobile:shrink-0 mobile:snap-start"
          />
        ))}
      </Reveal>
    </section>
  );
}
