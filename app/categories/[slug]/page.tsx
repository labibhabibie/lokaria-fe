import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  categories,
  categoryDetail as d,
  categoryLabel,
  routes,
} from "@/content/site";
import { RulesTabs } from "@/components/category/RulesTabs";
import { VenueGrid } from "@/components/category/VenueGrid";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

const find = (slug: string) => categories.find((c) => c.slug === slug);

export async function generateMetadata(
  props: PageProps<"/categories/[slug]">,
): Promise<Metadata> {
  const c = find((await props.params).slug);
  return c ? { title: c.title, description: c.detail.lead } : {};
}

const wrap =
  "mx-auto max-w-[1200px] px-[max(5vw,64px)] tablet:px-[42px] mobile:px-[18px]";
const h2 =
  "mt-2 mb-7 text-[clamp(28px,3.8vw,46px)] font-extrabold tracking-[-.03em] uppercase";

export default async function CategoryPage(
  props: PageProps<"/categories/[slug]">,
) {
  const c = find((await props.params).slug);
  if (!c) notFound();
  const book = routes.bookCategory(c.slug);

  return (
    <main className="bg-ivory">
      <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-ink text-white">
        <Image
          src={c.image.src}
          alt={c.image.alt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover brightness-[.72] saturate-[.85]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(#11111173_0%,#1113_40%,#111111f0_100%)]" />
        <div className="w-full px-[max(5vw,64px)] pt-[140px] pb-[60px] tablet:px-[42px] mobile:px-[18px]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* <Pill variant="glass" className="border-[#ffffff59] bg-[#ffffff2e]">
              {c.code}
            </Pill> */}
            <span className="text-[12px] font-bold tracking-[.05em] text-beige uppercase">
              {categoryLabel(c)}
            </span>
          </div>
          <h1 className="mb-[18px] text-[clamp(48px,6.8vw,96px)] leading-[.9] font-extrabold tracking-[-.05em] uppercase">
            {c.title}
          </h1>
          <p className="mb-8 max-w-[700px] font-serif text-[20px] leading-[1.55] text-[#ffffffe0] italic mobile:text-[18px]">
            {c.detail.lead}
          </p>
          <div className="flex flex-wrap gap-[18px]">
            <Button variant="beige" href={book}>
              {d.bookLabel(c.title)}
            </Button>
            <Button variant="outline-light" href={d.back.href}>
              {d.back.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-[60px]">
        <Reveal className={wrap}>
          <Eyebrow>{d.highlights.eyebrow}</Eyebrow>
          <h2 className={h2}>{d.highlights.heading}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
            {c.detail.highlights.map((t) => (
              <div
                key={t}
                className="rounded-2xl border border-[#1111110f] bg-ivory px-6 py-[22px] text-[14px] font-bold"
              >
                {t}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-b border-line bg-stone-2 py-[70px]">
        <Reveal className={wrap}>
          <Eyebrow>{d.venues.eyebrow}</Eyebrow>
          <h2 className={h2}>{d.venues.heading}</h2>
          <VenueGrid categorySlug={c.slug} venues={c.detail.venues} />
        </Reveal>
      </section>

      <section className="py-[70px]">
        <Reveal className={wrap}>
          <RulesTabs tabs={c.detail.rules} />
        </Reveal>
      </section>

      <section className="pt-5 pb-[100px]">
        <Reveal className={wrap}>
          <div className="rounded-card bg-olive px-12 py-[60px] text-center text-white mobile:px-6 mobile:py-12">
            <Eyebrow light>{d.cta.eyebrow}</Eyebrow>
            <h2 className="mt-3 mb-4 text-[clamp(32px,4.5vw,54px)] font-extrabold tracking-[-.04em] uppercase">
              {d.cta.heading}
            </h2>
            <p className="mx-auto mb-[34px] max-w-[540px] text-[16px] leading-[1.6] text-[#fffc]">
              {d.cta.body}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="beige" href={book}>
                {d.bookLabel(c.title)}
              </Button>
              <Button variant="outline-light" href={d.cta.secondary.href}>
                {d.cta.secondary.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
