import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "About — Aniket Naik",
  description: "About Aniket Naik, UI/UX designer and full-stack developer.",
};

// Placeholder until the real about content and reference layouts arrive.
export default function AboutPage() {
  return (
    <main>
      <section className="about" data-ground="chalk">
        <p className="eyebrow">
          <span className="eyebrow-rule" aria-hidden="true" />
          About
        </p>
        <h1 className="about-title">Aniket Naik</h1>
        <p className="about-line">
          UI/UX designer and full-stack web developer. This page is waiting on
          its copy — the layout lands once the reference and the words arrive.
        </p>
      </section>
      <Contact />
    </main>
  );
}
