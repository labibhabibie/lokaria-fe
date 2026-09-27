"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { hero } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroSwitcher } from "@/components/ui/HeroSwitcher";
import { TextLink } from "@/components/ui/TextLink";
import { cx } from "@/lib/cx";
import { HeroSearch } from "./HeroSearch";

const SLIDE_MS = 6000;

export function Hero() {
  const [active, setActive] = useState(0);
  const count = hero.slides.length;

  useEffect(() => {
    // Respect reduced motion: no auto-advance, switcher still works.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(t);
  }, [count, active]);

  return (
    <section className="relative isolate flex min-h-[max(100vh,720px)] flex-col overflow-hidden bg-ink text-white">
      {hero.slides.map((s, i) => (
        <div
          key={s.label}
          aria-hidden={i !== active}
          className={cx(
            "absolute inset-0 -z-10 [transition:opacity_1.2s,scale_7s] motion-reduce:[transition:opacity_1.2s]",
            i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
          )}
        >
          <Image src={s.image.src} alt={s.image.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(#0000_55%,#1119)]" />
        </div>
      ))}

      <div className="relative z-[2] px-[max(5vw,64px)] pt-[20vh] pb-[140px] tablet:px-[42px] tablet:pt-[180px] mobile:px-[18px] mobile:pt-[140px] mobile:pb-[110px]">
        <Eyebrow light>{hero.eyebrow}</Eyebrow>
        <DisplayHeading as="h1" size="xl" light {...hero.heading} />
        <div className="mt-[42px] flex flex-wrap items-end justify-between gap-[30px] border-t border-[#ffffff59] pt-6">
          <p className="m-0 max-w-[580px] text-[17.5px] leading-[1.7] text-[#ffffffd1] mobile:text-[16px]">{hero.sub}</p>
          <div className="flex flex-wrap items-center gap-[34px] mobile:gap-6">
            <Button variant="beige" href={hero.primary.href}>
              {hero.primary.label}
            </Button>
            <TextLink light href={hero.secondary.href}>
              {hero.secondary.label}
            </TextLink>
          </div>
        </div>
        <HeroSearch />
      </div>

      <HeroSwitcher
        items={hero.slides.map((s) => s.label)}
        active={active}
        onChange={setActive}
        className="absolute right-[max(5vw,64px)] bottom-[38px] z-[3] tablet:right-[42px] mobile:hidden"
      />
      <div className="absolute bottom-9 left-[max(5vw,64px)] z-[3] flex items-center gap-3 text-[11px] tracking-[.15em] uppercase tablet:hidden mobile:left-[18px] mobile:flex">
        <span className="h-px w-[34px] bg-white" />
        {hero.scrollHint}
      </div>
    </section>
  );
}
