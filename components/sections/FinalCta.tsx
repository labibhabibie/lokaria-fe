import Image from "next/image";
import { finalCta as f } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function FinalCta() {
  return (
    <section className="relative isolate flex min-h-[820px] items-center px-[max(5vw,64px)] py-[100px] text-white tablet:min-h-[680px] tablet:px-[42px] mobile:min-h-[600px] mobile:px-[18px] mobile:py-[82px]">
      <Image src={f.image.src} alt={f.image.alt} fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(#11111140,#11111166)]" />
      <Reveal>
        <Eyebrow light>{f.eyebrow}</Eyebrow>
        <DisplayHeading size="cta" light {...f.heading} />
        <p className="my-[35px] font-serif text-[22px] italic mobile:text-[19px]">{f.body}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="beige" href={f.primary.href}>
            {f.primary.label}
          </Button>
          <Button variant="outline-light" href={f.secondary.href}>
            {f.secondary.label}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
