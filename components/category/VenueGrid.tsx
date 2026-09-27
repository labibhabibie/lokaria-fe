"use client";

import { useState } from "react";
import { categoryDetail, routes, rupiah, type Venue } from "@/content/site";
import { FilterChip } from "@/components/ui/FilterChip";
import { SportCard } from "@/components/ui/SportCard";

/** Venues offering one Category, filterable by City. */
export function VenueGrid({ categorySlug, venues }: { categorySlug: string; venues: Venue[] }) {
  const [city, setCity] = useState<string | null>(null);
  const cities = [...new Set(venues.map((v) => v.city))];
  const shown = city ? venues.filter((v) => v.city === city) : venues;
  const t = categoryDetail.venues;
  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={city === null} count={venues.length} onClick={() => setCity(null)}>
          {t.all}
        </FilterChip>
        {cities.map((c) => (
          <FilterChip key={c} active={city === c} count={venues.filter((v) => v.city === c).length} onClick={() => setCity(c)}>
            {c}
          </FilterChip>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mobile:no-scrollbar mobile:-mx-[18px] mobile:flex mobile:snap-x mobile:snap-mandatory mobile:overflow-x-auto mobile:scroll-px-[18px] mobile:px-[18px] mobile:py-2">
        {shown.map((v, i) => {
          const book = `${routes.bookCategory(categorySlug)}&venue=${v.slug}`;
          return (
            <SportCard
              key={v.slug}
              index={String(i + 1).padStart(2, "0")}
              tag={v.tag}
              title={v.name}
              description={`${v.city} · ${v.description}`}
              price={rupiah(v.price)}
              unit={t.unit}
              image={v.image}
              live={v.live}
              href={book}
              detailsLabel={t.details}
              bookHref={book}
              bookLabel={t.book}
              className="mobile:w-[85vw] mobile:shrink-0 mobile:snap-start"
            />
          );
        })}
      </div>
    </>
  );
}
