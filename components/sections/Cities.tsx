import { cities, citiesSection as s, routes } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Cities() {
  return (
    <section className="section-pad bg-ivory">
      <Reveal>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} aside={s.sub} />
      </Reveal>
      <Reveal className="grid grid-cols-2 gap-[18px] mobile:no-scrollbar mobile:-mx-[18px] mobile:flex mobile:snap-x mobile:snap-mandatory mobile:overflow-x-auto mobile:scroll-px-[18px] mobile:px-[18px]">
        {cities.map((c) => (
          <DestinationCard
            key={c.slug}
            href={routes.bookCity(c.slug)}
            label={c.label}
            meta={c.meta}
            title={c.title}
            subtitle={c.subtitle}
            note={s.note}
            image={c.image}
            className="mobile:w-[85vw] mobile:shrink-0 mobile:snap-start"
          />
        ))}
      </Reveal>
    </section>
  );
}
