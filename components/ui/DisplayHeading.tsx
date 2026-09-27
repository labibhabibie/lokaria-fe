import type { ReactNode } from "react";
import type { Accented } from "@/content/site";
import { cx } from "@/lib/cx";

export type DisplaySize = "xl" | "lg" | "md" | "sm" | "categories" | "events" | "cta";

const SIZE: Record<DisplaySize, string> = {
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
  sm: "text-display-sm",
  categories: "text-display-categories",
  events: "text-display-events",
  cta: "text-display-cta",
};

type Props = Accented & {
  as?: "h1" | "h2" | "h3";
  size?: DisplaySize;
  light?: boolean;
  className?: string;
  children?: ReactNode;
};

/** Manrope 750 uppercase display; the `accent` word renders in Lora italic. */
export function DisplayHeading({ as: Tag = "h2", size = "lg", before, accent, after, light, className, children }: Props) {
  return (
    <Tag className={cx("m-0 font-sans font-display uppercase text-balance", SIZE[size], light ? "text-white" : "text-ink", className)}>
      {children}
      {before}
      {before && accent ? " " : ""}
      {accent && <em className={cx("font-serif font-medium normal-case italic", light ? "text-beige" : "text-inherit")}>{accent}</em>}
      {after ? " " : ""}
      {after}
    </Tag>
  );
}
