import { events as e, routes } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { EventRow } from "@/components/ui/EventRow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";

export function Events() {
  return (
    <section id="events" className="section-pad bg-beige">
      <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-8">
        <div>
          <Eyebrow>{e.eyebrow}</Eyebrow>
          <DisplayHeading size="events" {...e.heading} />
        </div>
        <TextLink href={e.link.href}>{e.link.label}</TextLink>
      </Reveal>
      <Reveal className="border-b border-[#1113]">
        {e.items.map((ev) => (
          <EventRow key={ev.slug} day={ev.day} month={ev.month} type={ev.tag} title={ev.title} tagline={ev.description} href={routes.event(ev.slug)} />
        ))}
      </Reveal>
    </section>
  );
}
