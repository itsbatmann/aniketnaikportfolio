import type { Metadata } from "next";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { SITE } from "@/lib/site";

const description =
  "How Aniket Naik came to design: a self-taught route into UI/UX and full-stack web development, and the visual language built along the way.";

export const metadata: Metadata = {
  // Bare title — the root layout's template appends the site name.
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: `About ${SITE.name}`,
    description,
  },
  twitter: {
    title: `About ${SITE.name}`,
    description,
  },
};

export default function AboutPage() {
  return (
    <main>
      <About />
      <Contact />
    </main>
  );
}
