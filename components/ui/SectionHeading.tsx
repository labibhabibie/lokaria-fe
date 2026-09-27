import type { ReactNode } from "react";
import type { Accented } from "@/content/site";
import { cx } from "@/lib/cx";
import { DisplayHeading, type DisplaySize } from "./DisplayHeading";
import { Eyebrow } from "./Eyebrow";

type Props = {
  eyebrow?: string;
  heading: Accented;
  aside?: ReactNode;
  light?: boolean;
  size?: DisplaySize;
  divided?: boolean;
  className?: string;
};

export function SectionHeading({ eyebrow, heading, aside, light, size = "lg", divided, className }: Props) {
  return (
    <div
      className={cx(
        "mb-16 flex flex-wrap items-end justify-between gap-[50px]",
        divided && "border-b border-[#1111111f] pb-8",
        className,
      )}
    >
      <div>
        {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
        <DisplayHeading size={size} light={light} {...heading} />
      </div>
      {aside &&
        (typeof aside === "string" ? (
          <p className={cx("m-0 max-w-[380px] text-[14px] leading-[1.7]", light ? "text-[#ffffffb3]" : "text-ink")}>{aside}</p>
        ) : (
          aside
        ))}
    </div>
  );
}
