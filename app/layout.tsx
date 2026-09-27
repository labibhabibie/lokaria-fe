import type { Metadata } from "next";
import { Lora, Manrope } from "next/font/google";
import { brand, nav } from "@/content/site";
import { AppFrame } from "@/components/auth/AppFrame";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Footer } from "@/components/sections/Footer";
import { NavBar } from "@/components/ui/NavBar";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: { default: brand.meta.title, template: `%s | ${brand.name}` },
  description: brand.meta.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${lora.variable}`}
    >
      <body>
        <AuthProvider>
          <AppFrame
            header={<NavBar wordmark={brand.wordmark} links={nav.links} signIn={nav.signIn} cta={nav.cta} floatingCta={nav.floatingCta} />}
            footer={<Footer />}
          >
            {children}
          </AppFrame>
        </AuthProvider>
      </body>
    </html>
  );
}
