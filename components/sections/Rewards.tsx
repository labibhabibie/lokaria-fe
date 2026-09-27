import { brand, rewards as r } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LoyaltyCard } from "@/components/ui/LoyaltyCard";

export function Rewards() {
  return (
    <section
      id={r.id}
      className="section-pad relative grid grid-cols-[minmax(0,1.08fr)_minmax(360px,.72fr)] items-center gap-[clamp(55px,8vw,130px)] overflow-hidden bg-beige tablet:grid-cols-1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[2vw] -bottom-[4vw] font-serif text-[clamp(150px,22vw,330px)] leading-[.7] font-semibold tracking-[-.08em] text-[#f5f2ec2e]"
      >
        {brand.wordmark}
      </div>
      <Reveal className="relative">
        <Eyebrow>{r.eyebrow}</Eyebrow>
        <h2 className="my-7 font-serif text-[clamp(58px,6.7vw,98px)] leading-[.86] font-medium tracking-[-.055em] uppercase mobile:text-[48px]">
          {r.heading.before} <em className="font-normal">{r.heading.accent}</em>
        </h2>
        <p className="max-w-[600px] text-[14px] leading-[1.85] text-[#111111b3]">{r.body}</p>
        <div className="mt-[42px] flex items-center gap-7 mobile:flex-col mobile:items-start mobile:gap-4">
          {r.stats.map((stat, i) => (
            <div key={stat.value} className="contents">
              {i > 0 && <span className="text-[20px] mobile:rotate-90">→</span>}
              <span className="flex flex-col gap-[5px]">
                <b className="font-serif text-[29px] font-semibold">{stat.value}</b>
                <small className="text-[11px] tracking-[.14em] text-[#1111118c] uppercase">{stat.label}</small>
              </span>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal className="relative">
        <LoyaltyCard {...r.card} />
      </Reveal>
    </section>
  );
}
