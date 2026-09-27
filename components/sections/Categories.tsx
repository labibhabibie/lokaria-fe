import { categories, categoriesSection as s, categoryLabel, routes, type CategoryAccent } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { Chip } from "@/components/ui/Chip";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SportWorldCard } from "@/components/ui/SportWorldCard";
import { cx } from "@/lib/cx";

const ACCENT: Record<CategoryAccent, string> = {
  football: "bg-cat-football",
  padel: "bg-cat-padel",
  tennis: "bg-cat-tennis",
  badminton: "bg-cat-badminton",
  music: "bg-cat-music",
  fishing: "bg-cat-fishing",
};

export function Categories() {
  return (
    <section id={s.id} className="section-pad bg-[radial-gradient(circle_at_84%_5%,#c6ae942e,transparent_27%),var(--color-ivory)]">
      <Reveal className="mb-[clamp(40px,5vw,72px)] grid grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)] items-end gap-[clamp(36px,7vw,110px)] tablet:grid-cols-1">
        <div>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <DisplayHeading size="categories" {...s.heading} />
        </div>
        <p className="mb-1 max-w-[430px] border-t border-[#1113] pt-6 font-serif text-[16px] leading-[1.62] text-[#111111a8] italic">{s.sub}</p>
      </Reveal>
      <Reveal className="grid grid-cols-12 gap-[18px] mobile:no-scrollbar mobile:-mx-[18px] mobile:flex mobile:snap-x mobile:snap-mandatory mobile:overflow-x-auto mobile:scroll-px-[18px] mobile:px-[18px]">
        {categories.map((c, i) => {
          const row = Math.floor(i / 2);
          return (
            <div key={c.slug} className={cx(c.span === 7 ? "col-span-7" : "col-span-5", "tablet:col-span-6 mobile:w-[85vw] mobile:shrink-0 mobile:snap-start")}>
              <SportWorldCard
                index={c.index}
                code={c.code}
                title={c.title}
                description={c.description}
                price={categoryLabel(c)}
                image={c.image}
                accentClassName={ACCENT[c.accent]}
                detailsHref={routes.category(c.slug)}
                detailsLabel={s.detailsLabel}
                bookHref={routes.bookCategory(c.slug)}
                bookLabel={s.bookLabel}
                className={cx("h-full", row === 1 ? "min-h-[460px]" : "min-h-[520px]", "mobile:min-h-[480px]")}
              />
            </div>
          );
        })}
      </Reveal>
      <Reveal className="mt-10 flex flex-wrap items-center gap-2">
        <span className="mr-3 text-[12px] font-extrabold tracking-eyebrow text-olive uppercase">{s.comingSoon.label}</span>
        {s.comingSoon.items.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </Reveal>
    </section>
  );
}
