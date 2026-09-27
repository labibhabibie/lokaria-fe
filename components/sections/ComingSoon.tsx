import { brand, comingSoon as c } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Branded placeholder for routes that are linked but not built yet. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <main>
      <section className="relative flex min-h-[max(80vh,640px)] items-end overflow-hidden bg-[radial-gradient(circle_at_82%_14%,#c6ae9421,transparent_27%),linear-gradient(145deg,var(--color-olive-deep),var(--color-olive)_52%,var(--color-olive-darker))] px-[max(5vw,64px)] pt-[180px] pb-[112px] text-white tablet:px-[42px] tablet:pb-[100px] mobile:px-[18px] mobile:pt-[140px] mobile:pb-[82px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-.12em] -right-[3vw] text-[clamp(160px,23vw,360px)] leading-none font-extrabold tracking-[-.08em] text-[#f5f2ec09]"
        >
          {brand.wordmark}
        </div>
        <div className="relative">
          <Eyebrow light>{c.eyebrow}</Eyebrow>
          <DisplayHeading as="h1" size="lg" light before={title} />
          <p className="my-[35px] max-w-[560px] font-serif text-[22px] leading-[1.5] italic mobile:text-[19px]">{c.body}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="beige" href={c.primary.href}>
              {c.primary.label}
            </Button>
            <Button variant="outline-light" href={c.secondary.href}>
              {c.secondary.label}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
