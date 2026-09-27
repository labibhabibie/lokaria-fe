import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { SmartLink } from "./SmartLink";

type Props = { href: string; light?: boolean; onClick?: () => void; className?: string; children: ReactNode };

export function TextLink({ href, light, onClick, className, children }: Props) {
  return (
    <SmartLink
      href={href}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-[30px] border-b border-current pb-2 font-sans text-[12px] font-extrabold tracking-[.1em] uppercase no-underline transition-[color,border-color] duration-[250ms]",
        light ? "text-white hover:border-beige hover:text-beige" : "text-ink hover:border-brown hover:text-brown",
        className,
      )}
    >
      {children}
    </SmartLink>
  );
}
