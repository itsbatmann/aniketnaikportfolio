"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { PROJECTS } from "@/lib/projects";
import ProjectMotif from "./ProjectMotif";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

export default function WorkIndex() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const rows = q(".work-row");
      const links = q(".work-link");
      const head = q("[data-micro]");

      // autoAlpha goes on the link, not the row: an inline opacity on the row
      // would beat the CSS rule that dims the rows you are not hovering.
      gsap.set([...links, ...head], { autoAlpha: 1 });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!reduced) {
        gsap.from(head, {
          autoAlpha: 0,
          y: 14,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        });

        rows.forEach((row) => {
          const rule = row.querySelector(".row-rule");
          const inner = row.querySelector(".work-link");
          gsap
            .timeline({
              scrollTrigger: { trigger: row, start: "top 88%", once: true },
            })
            .from(rule, { scaleX: 0, duration: 1.1, ease: "expo.out" })
            .from(
              inner,
              { autoAlpha: 0, y: 26, duration: 1, ease: "power3.out" },
              0.08,
            );
        });
      }

      // Desktop only: a card of the project follows the pointer.
      const card = preview.current;
      if (!card || !window.matchMedia("(pointer: fine)").matches) return;

      const xTo = gsap.quickTo(card, "x", { duration: 0.55, ease: "power3" });
      const yTo = gsap.quickTo(card, "y", { duration: 0.55, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  // Fade the card with the hovered row, and draw its motif each time.
  useGSAP(
    () => {
      const card = preview.current;
      if (!card || !window.matchMedia("(pointer: fine)").matches) return;

      const open = active !== null;
      gsap.to(card, {
        autoAlpha: open ? 1 : 0,
        scale: open ? 1 : 0.94,
        duration: 0.45,
        ease: "power3.out",
      });

      if (!open) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        card.querySelectorAll(".motif path, .motif circle"),
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.9, ease: "power2.out", stagger: 0.035 },
      );
    },
    { dependencies: [active] },
  );

  return (
    <section
      ref={root}
      id="work"
      className="work"
      aria-label="Selected work"
      data-ground="chalk"
    >
      <div className="section-head">
        <h2 className="eyebrow" data-micro data-anim>
          <span className="eyebrow-rule" aria-hidden="true" />
          Selected work
        </h2>
        <p className="section-note" data-micro data-anim>
          Four builds — two front-end studies, one full-stack product, one in
          progress.
        </p>
        <p className="section-count" data-micro data-anim>
          ({String(PROJECTS.length).padStart(2, "0")})
        </p>
      </div>

      <ol className="work-list">
        {PROJECTS.map((project, i) => (
          <li
            key={project.slug}
            className="work-row"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
          >
            <span className="row-rule" aria-hidden="true" />
            <Link
              href={`/work/${project.slug}`}
              className="work-link"
              data-anim
            >
              <span className="row-no">{project.no}</span>

              <span className="row-main">
                <h3 className="row-title">{project.title}</h3>
                <span className="row-line">{project.line}</span>
              </span>

              <span className="row-meta">
                <span className="row-scope">
                  {project.scope}
                  {project.status ? ` — ${project.status}` : ""}
                </span>
                <span className="row-stack">{project.stack.join(" · ")}</span>
              </span>

              <span className="row-year">{project.year}</span>

              <span className="row-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M6 18L18 6M9 6h9v9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div ref={preview} className="work-preview" aria-hidden="true">
        {active !== null ? (
          <>
            <ProjectMotif motif={PROJECTS[active].motif} />
            <span className="preview-label">
              {PROJECTS[active].scope} — {PROJECTS[active].year}
            </span>
          </>
        ) : null}
      </div>
    </section>
  );
}
