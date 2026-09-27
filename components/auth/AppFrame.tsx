"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isAuthPath, isPortalPath } from "@/lib/auth/routes";

type Props = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export function AppFrame({ header, footer, children }: Props) {
  const pathname = usePathname();
  const focusedAppSurface = isAuthPath(pathname) || isPortalPath(pathname);

  return (
    <>
      {!focusedAppSurface && header}
      {children}
      {!focusedAppSurface && footer}
    </>
  );
}
