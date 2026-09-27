import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { comingSoon } from "@/content/site";
import { ComingSoon } from "@/components/sections/ComingSoon";

// Only the routes listed in content/site.ts render; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(comingSoon.pages).map((p) => ({ path: p.split("/") }));
}

export async function generateMetadata(props: PageProps<"/[...path]">): Promise<Metadata> {
  const { path } = await props.params;
  return { title: comingSoon.pages[path.join("/")] };
}

export default async function Page(props: PageProps<"/[...path]">) {
  const { path } = await props.params;
  const title = comingSoon.pages[path.join("/")];
  if (!title) notFound();
  return <ComingSoon title={title} />;
}
