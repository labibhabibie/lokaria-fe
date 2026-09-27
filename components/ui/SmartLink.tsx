import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string };

/** next/link for internal paths, a plain anchor (new tab) for external URLs. */
export function SmartLink({ href, ...rest }: Props) {
  if (/^https?:\/\//.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" {...rest} />;
  return <Link href={href} {...rest} />;
}
