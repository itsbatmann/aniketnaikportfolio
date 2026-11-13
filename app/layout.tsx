import type { Metadata } from "next";
import { Anton, Caveat, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import ScrollReset from "@/components/ScrollReset";
import { SITE, SITE_URL, absoluteUrl } from "@/lib/site";

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
  // Resolves every relative URL in page metadata (canonicals, OG images)
  // against the canonical origin — the same one the sitemap uses.
  metadataBase: new URL(SITE_URL),
  // NOTE: no `alternates.canonical` here. A canonical set on the root layout
  // is inherited by every child route, which would point /about and all four
  // case pages at the home page and ask Google to drop them from the index.
  // Each page declares its own.
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    // Child pages set a bare title; this appends the site name for them.
    template: `%s — ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.shortName,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.shortName,
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Lets Google show a full-length snippet, a large thumbnail and video
      // previews instead of the conservative defaults it falls back to.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

/**
 * Identity graph for the site. `ProfilePage` + `Person` is the pairing Google
 * documents for a personal site, and it is what gives the name query something
 * structured to attach to.
 */
const personLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: SITE.name,
    url: SITE_URL,
    jobTitle: SITE.role,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE.locality,
    },
    knowsAbout: [
      "UI design",
      "UX design",
      "Design systems",
      "Front-end development",
      "Next.js",
      "React",
      "GSAP",
    ],
    sameAs: [...SITE.socials],
  },
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
        {/* Rendered on the server so it is present in the HTML a crawler
            receives without executing any JavaScript. */}
        <script
          type="application/ld+json"
          // The payload is a literal defined above — no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <ScrollReset />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
