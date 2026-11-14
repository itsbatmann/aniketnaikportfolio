import type { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WorkIndex from "@/components/WorkIndex";
import Contact from "@/components/Contact";

// The home page declares its own canonical rather than inheriting one from the
// layout; see the note on `metadata` in app/layout.tsx.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <WorkIndex />
      <Contact />
    </main>
  );
}
