import type { Metadata } from "next";
import { Anton, Caveat, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import ScrollReset from "@/components/ScrollReset";

// The display face: a Didone with the thick/thin contrast of the reference
// lockup. `optical sizing` is on by default for variable fonts, which is what
// keeps the hairlines from collapsing at hero size.
const display = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// The about lockup is a different register from the hero: a heavy condensed
// grotesk, set tight, with the first name carrying the accent colour.
const poster = Anton({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// The handwritten sign-off under the bio.
const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

// Acumin Pro is an Adobe Fonts family, so it cannot be bundled with
// next/font. Put your kit id in .env.local as NEXT_PUBLIC_TYPEKIT_ID and the
// stylesheet below loads it; without it the stack falls back to Helvetica/Arial.
const typekitId = process.env.NEXT_PUBLIC_TYPEKIT_ID;

export const metadata: Metadata = {
  title: "Aniket Naik — Portfolio",
  description:
    "Portfolio of Aniket Naik, UI/UX designer and full-stack web developer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${poster.variable} ${hand.variable} js-ready h-full antialiased`}
    >
      <body className="min-h-full">
        {typekitId ? (
          <link
            rel="stylesheet"
            href={`https://use.typekit.net/${typekitId}.css`}
          />
        ) : null}
        {/* `js-ready` is rendered on the server so hydration matches; without
            JavaScript this puts the animated parts straight back on screen. */}
        <noscript>
          <style>{`[data-anim]{visibility:visible!important}`}</style>
        </noscript>
        <ScrollReset />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
