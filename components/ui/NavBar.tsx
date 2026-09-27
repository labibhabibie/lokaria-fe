"use client";

import { useEffect, useRef, useState } from "react";
import type { LinkItem } from "@/content/site";
import { cx } from "@/lib/cx";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { SmartLink } from "./SmartLink";
import { TextLink } from "./TextLink";

type Props = {
  wordmark: string;
  links: LinkItem[];
  signIn: LinkItem;
  cta: LinkItem;
  floatingCta: LinkItem;
};

/** Last two letters of the wordmark render in beige. */
function Wordmark({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <SmartLink href="/" onClick={onClick} className="justify-self-start text-[27px] font-extrabold tracking-[-1.5px] text-white no-underline">
      {text.slice(0, -2)}
      <span className="text-beige">{text.slice(-2)}</span>
    </SmartLink>
  );
}

export function NavBar({ wordmark, links, signIn, cta, floatingCta }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.querySelector("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav
        className={cx(
          "fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b px-[max(3.5vw,40px)] font-sans text-white transition-all duration-[450ms]",
          "tablet:grid-cols-[1fr_auto] mobile:px-[18px]",
          scrolled ? "h-[76px] border-[#f5f2ec24] bg-[#535b40ed] backdrop-blur-[18px]" : "h-[92px] border-transparent bg-transparent",
        )}
      >
        <Wordmark text={wordmark} />
        <div className="flex gap-[27px] text-[16px] font-[650] tablet:hidden">
          {links.map((l) => (
            <SmartLink key={l.href} href={l.href} className="group relative text-white no-underline">
              {l.label}
              <span className="absolute right-full -bottom-1.5 left-0 h-px bg-current transition-all duration-300 group-hover:right-0" />
            </SmartLink>
          ))}
        </div>
        <div className="flex items-center justify-end gap-[26px] text-[16px] tablet:hidden">
          <SmartLink href={signIn.href} className="text-white no-underline">
            {signIn.label}
          </SmartLink>
          <Button variant="ivory" size="sm" href={cta.href} className="min-h-[42px]! px-[18px]! py-1 backdrop-blur-[10px]">
            {cta.label}
          </Button>
        </div>
        <div className="hidden justify-self-end tablet:block">
          <IconButton label="Open menu" variant="glass" size={44} onClick={() => setOpen(true)}>
            ☰
          </IconButton>
        </div>
      </nav>

      {/* Floating Book button — phones only */}
      <SmartLink
        href={floatingCta.href}
        className={cx(
          "fixed right-5 bottom-5 z-40 hidden size-16 place-items-center rounded-full bg-beige text-[11px] font-extrabold tracking-button text-ink uppercase no-underline shadow-panel transition-transform duration-300 active:scale-[.97] mobile:grid",
          open && "mobile:hidden",
        )}
      >
        {floatingCta.label}
      </SmartLink>

      {/* Full-screen mobile menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className={cx(
          "fixed inset-0 z-[60] hidden flex-col overflow-hidden bg-olive px-[max(3.5vw,40px)] pb-8 font-sans text-white transition-opacity duration-300 ease-out-soft tablet:flex mobile:px-[18px]",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[3vw] bottom-[-.1em] text-[clamp(160px,23vw,360px)] leading-none font-extrabold tracking-[-.08em] text-[#f5f2ec09]"
        >
          {wordmark}
        </div>
        <div className="flex h-[92px] shrink-0 items-center justify-between">
          <Wordmark text={wordmark} onClick={close} />
          <div ref={closeRef}>
            <IconButton label="Close menu" variant="glass" size={44} onClick={close}>
              ×
            </IconButton>
          </div>
        </div>
        <ul className="relative mt-6 list-none border-t border-[#ffffff26] p-0">
          {links.map((l) => (
            <li key={l.href} className="border-b border-[#ffffff26]">
              <SmartLink
                href={l.href}
                onClick={close}
                className="flex items-center justify-between py-5 text-[42px] leading-[.9] font-display tracking-[-.055em] text-white uppercase no-underline transition-colors duration-300 hover:text-beige mobile:text-[36px]"
              >
                {l.label}
                <span className="text-[20px] tracking-normal">↗</span>
              </SmartLink>
            </li>
          ))}
        </ul>
        <div className="relative mt-auto flex flex-col items-start gap-6 pt-10">
          <TextLink light href={signIn.href} onClick={close}>
            {signIn.label}
          </TextLink>
          <Button variant="beige" size="lg" fullWidth href={cta.href} onClick={close}>
            {cta.label}
          </Button>
        </div>
      </div>
    </>
  );
}
