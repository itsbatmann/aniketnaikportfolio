import type { Metadata } from "next";
import About from "@/components/About";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "About — Aniket Naik",
  description: "About Aniket Naik, UI/UX designer and full-stack developer.",
};

export default function AboutPage() {
  return (
    <main>
      <About />
      <Contact />
    </main>
  );
}
