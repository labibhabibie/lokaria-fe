"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { AdminWorkspace } from "@/components/portal/AdminWorkspace";
import { CustomerWorkspace } from "@/components/portal/CustomerWorkspace";
import { PartnerWorkspace } from "@/components/portal/PartnerWorkspace";
import {
  getHomeRoute,
  getMobileNavigation,
  getPortalNavigation,
  roleLabel,
  type PortalPageDefinition,
} from "@/lib/auth/routes";
import { USER_ROLES } from "@/lib/auth/types";
import { useAuth } from "./AuthProvider";
import { ProfileMenu } from "./ProfileMenu";
import { RoleGuard } from "./RoleGuard";

function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  if (!user) return null;

  const navigation = getPortalNavigation(user.role);
  const mobileNavigation = getMobileNavigation(user.role);
  const home = getHomeRoute(user.role);

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-[#ffffff1f] bg-olive px-[max(3vw,32px)] text-white mobile:px-[18px]">
        <SmartLink href={home} className="text-[24px] font-extrabold tracking-[-1.5px] text-white no-underline">
          LOKAR<span className="text-beige">IA</span>
        </SmartLink>
        <ProfileMenu />
      </header>

      <div className="grid min-h-[calc(100vh-76px)] grid-cols-[250px_minmax(0,1fr)] tablet:grid-cols-1">
        <aside className="border-r border-line bg-white p-5 tablet:border-r-0 tablet:border-b tablet:p-3">
          <nav
            aria-label={`Navigasi ${roleLabel(user.role)}`}
            className="sticky top-[96px] flex flex-col gap-1 tablet:hidden"
          >
            {user.role === USER_ROLES.CUSTOMER && (
              <SmartLink href="/" className="rounded-field px-3 py-2.5 text-[11px] font-bold whitespace-nowrap text-[#1111119c] no-underline hover:bg-ivory">
                Beranda Publik
              </SmartLink>
            )}
            {navigation.map((item) => {
              const active = pathname === item.path;
              return (
                <SmartLink
                  key={item.path}
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-field px-3 py-2.5 text-[11px] font-bold whitespace-nowrap no-underline transition-colors ${active ? "bg-olive text-white" : "text-[#1111119c] hover:bg-ivory hover:text-ink"}`}
                >
                  {item.navLabel}
                </SmartLink>
              );
            })}
          </nav>
          <nav
            aria-label={`Navigasi seluler ${roleLabel(user.role)}`}
            className="hidden grid-cols-4 gap-1 tablet:grid"
          >
            {mobileNavigation.map((item) => {
              const active = pathname === item.path;
              return (
                <SmartLink
                  key={item.path}
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`grid min-h-11 place-items-center rounded-field px-2 text-center text-[9px] font-extrabold no-underline ${
                    active ? "bg-olive text-white" : "text-[#1111118c] hover:bg-ivory"
                  }`}
                >
                  {item.navLabel}
                </SmartLink>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 p-[clamp(24px,4vw,56px)] mobile:px-[18px] mobile:py-8">
          {children}
        </div>
      </div>
    </main>
  );
}

export function PortalPage({ page }: { page: PortalPageDefinition }) {
  const { user } = useAuth();

  const workspace = user?.role === USER_ROLES.CUSTOMER
    ? <CustomerWorkspace path={page.path} />
    : user?.role === USER_ROLES.PARTNER_OWNER || user?.role === USER_ROLES.PARTNER_STAFF
      ? <PartnerWorkspace path={page.path} />
      : <AdminWorkspace path={page.path} />;

  return (
    <RoleGuard allowedRoles={page.roles}>
      <PortalShell>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
            <div>
              <p className="mb-2 text-[9px] font-extrabold tracking-eyebrow text-olive uppercase">
                {user ? roleLabel(user.role) : "Ruang Kerja"} / Pratinjau lokal
              </p>
              <h1 className="text-[clamp(27px,4vw,44px)] leading-none font-extrabold uppercase">
                {page.title}
              </h1>
              <p className="mt-3 max-w-[680px] text-[12px] leading-[1.6] text-[#11111180]">
                {page.description}
              </p>
            </div>
            <span className="rounded-full border border-[#535b4040] bg-[#535b4012] px-4 py-2 text-[9px] font-extrabold tracking-label text-olive uppercase">
              Data demo
            </span>
          </div>
          {workspace}
        </div>
      </PortalShell>
    </RoleGuard>
  );
}
