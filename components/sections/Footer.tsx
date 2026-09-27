import { footer as f } from "@/content/site";
import { NewsletterField } from "@/components/ui/NewsletterField";
import { SmartLink } from "@/components/ui/SmartLink";

export function Footer() {
  return (
    <footer className="bg-olive px-[max(5vw,64px)] pt-28 pb-[35px] text-white tablet:px-[42px] tablet:pt-[100px] mobile:px-[18px] mobile:pt-[82px]">
      <div className="flex flex-wrap items-start justify-between gap-10 pb-[100px] mobile:pb-16">
        <div className="text-[clamp(75px,12vw,180px)] leading-[.7] font-extrabold tracking-[-.1em] mobile:text-[64px]">
          {f.wordmark}
          <span className="text-beige">.</span>
        </div>
        <NewsletterField {...f.newsletter} />
      </div>
      <div className="grid grid-cols-6 gap-[30px] border-t border-[#fff3] py-[55px] tablet:grid-cols-3 mobile:grid-cols-2 mobile:gap-y-10">
        {f.columns.map((col) => (
          <div key={col.heading} className="flex flex-col gap-[11px]">
            <p className="mb-3 text-[11.5px] tracking-[.15em] text-beige uppercase">{col.heading}</p>
            {col.links.map((l) => (
              <SmartLink key={l.label} href={l.href} className="text-[13.5px] text-[#ffffffb8] no-underline transition-colors duration-300 hover:text-white">
                {l.label}
              </SmartLink>
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-4 border-t border-[#fff3] pt-6 text-[11.5px] tracking-[.1em] text-[#ffffff8c] uppercase mobile:grid-cols-1">
        <p className="m-0">{f.bottom.left}</p>
        <p className="m-0">{f.bottom.middle}</p>
        <div className="flex gap-5">
          {f.bottom.links.map((l) => (
            <SmartLink key={l.label} href={l.href} className="text-inherit no-underline hover:text-white">
              {l.label}
            </SmartLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
