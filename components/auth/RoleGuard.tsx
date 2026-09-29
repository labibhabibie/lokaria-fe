"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { roleCanAccess } from "@/lib/auth/routes";
import type { UserRole } from "@/lib/auth/types";
import { useAuth } from "./AuthProvider";

export function RoleGuard({ allowedRoles, children }: { allowedRoles: readonly UserRole[]; children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const allowed = Boolean(user && roleCanAccess(user.role, allowedRoles));

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
    if (status === "authenticated" && user && !allowed) router.replace("/");
  }, [allowed, router, status, user]);

  if (status === "loading" || !allowed) {
    return (
      <main className="grid min-h-screen place-items-center bg-ivory px-5 text-ink">
        <div className="flex items-center gap-3 text-[12px] font-extrabold tracking-label uppercase">
          <span className="size-2 animate-pulse rounded-full bg-olive" />
          Memeriksa sesi
        </div>
      </main>
    );
  }

  return children;
}
