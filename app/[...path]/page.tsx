import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginPage } from "@/components/auth/LoginPage";
import { PortalPage } from "@/components/auth/PortalPage";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { categories, comingSoon } from "@/content/site";
import { PROTECTED_STATIC_PATHS, resolveProtectedPage } from "@/lib/auth/routes";

// Only the routes listed in content/site.ts render; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  const venues = categories.flatMap((category) => category.detail.venues.map((venue) => `venues/${venue.slug}`));
  const paths = new Set(["login", "auth", ...Object.keys(comingSoon.pages), ...PROTECTED_STATIC_PATHS, ...venues]);
  return [...paths].map((path) => ({ path: path.split("/") }));
}

export async function generateMetadata(props: PageProps<"/[...path]">): Promise<Metadata> {
  const { path } = await props.params;
  const key = path.join("/");
  if (key === "login" || key === "auth") return { title: "Local Login" };
  return { title: resolveProtectedPage(`/${key}`)?.title ?? comingSoon.pages[key] };
}

export default async function Page(props: PageProps<"/[...path]">) {
  const { path } = await props.params;
  const key = path.join("/");
  if (key === "login" || key === "auth") return <LoginPage />;
  const protectedPage = resolveProtectedPage(`/${key}`);
  if (protectedPage) return <PortalPage page={protectedPage} />;
  const title = comingSoon.pages[key];
  if (!title) notFound();
  return <ComingSoon title={title} />;
}
