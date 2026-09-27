// app/layout.tsx — font wiring for the design system
import { Manrope, Lora } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["300","400","500","600","700","800"], variable: "--font-manrope" });
const lora = Lora({ subsets: ["latin"], weight: ["400","500","600"], style: ["normal","italic"], variable: "--font-lora" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
