"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { PROJECTS } from "@/lib/projects";
import ProjectMotif from "./ProjectMotif";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

export default function WorkIndex() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [strip] = q(".posters");
      const posters = q(".poster");
      // The card and its case link travel together, or the card slides over
      // the link on the way in.
      const cells = q(".poster-cell");
      const head = q("[data-micro]");
      const [lede] = q(".work-lede");

      gsap.set([...posters, ...head, lede], { autoAlpha: 1 });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const seen = (el: Element | null, ratio: number) =>
        !el || el.getBoundingClientRect().top < window.innerHeight * ratio;
      const at = (el: Element | null, ratio: number) =>
        seen(el, ratio)
          ? undefined
          : { trigger: el as Element, start: `top ${ratio * 100}%`, once: true };

      if (!reduced) {
        gsap.from([lede, ...head], {
          autoAlpha: 0,
          y: 14,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: at(root.current, 0.75),
        });

        // The posters deal in like a hand of cards.
        gsap.from(cells, {
          autoAlpha: 0,
          y: 48,
          duration: 1.1,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: at(strip, 0.88),
        });
      }

      // Each poster draws its line work on the way in, and again on hover.
      const drawn = new WeakSet<Element>();
      const draw = (poster: Element) => {
        if (reduced) return;
        const lines = poster.querySelectorAll(".motif path, .motif circle");
        if (!lines.length) return;
        gsap.fromTo(
          lines,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1, ease: "power2.out", stagger: 0.03 },
        );
      };

      posters.forEach((poster) => {
        ScrollTrigger.create({
          trigger: poster,
          start: "top 88%",
          once: true,
          onEnter: () => {
            drawn.add(poster);
            draw(poster);
          },
        });
        poster.addEventListener("pointerenter", () => {
          if (drawn.has(poster)) draw(poster);
        });
      });

    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="work"
      className="work"
      aria-label="Selected work"
      data-ground="pitch"
    >
      <div className="work-inner">
        <div className="work-rack">
          <ul className="posters">
            {PROJECTS.map((project, i) => {
              /* As in the reference: a lit card, a photograph, a lit card,
                 a photograph. */
              const tone = project.cover ? "photo" : i === 0 ? "lit" : "lit-b";

              const face = (
                <>
                  {/* Drop a screenshot at /public/work/<slug>.jpg and set
                      `cover` on the project to use it; the others keep the
                      gradient and the line drawing. */}
                  {project.cover ? (
                    <span
                      className="poster-cover"
                      aria-hidden="true"
                      style={
                        {
                          "--cover": `url(${project.cover})`,
                        } as React.CSSProperties
                      }
                    />
                  ) : (
                    <span className="poster-art" aria-hidden="true">
                      <ProjectMotif motif={project.motif} />
                    </span>
                  )}

                  <span className="poster-top">
                    <span>{project.status ?? project.scope}</span>
                    <span className="poster-index">/{project.no}</span>
                  </span>

                  <span className="poster-foot">
                    <h3 className="poster-title">/{project.title}</h3>
                    <p className="poster-note">{project.line}</p>

                    {/* Held back until the card is hovered or focused. */}
                    <span className="poster-more">
                      <span className="poster-open">
                        {project.href ? "Visit" : "In progress · coming soon"}
                        {project.href ? (
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              d="M6 18L18 6M9 6h9v9"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : null}
                      </span>
                    </span>
                  </span>
                </>
              );

              return (
                <li key={project.slug} className="poster-cell">
                  {project.href ? (
                    /* The card is the live site, in a new tab. */
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="poster"
                      data-tone={tone}
                      data-anim
                    >
                      {face}
                    </a>
                  ) : (
                    /* No site yet: the card goes nowhere, and says so. */
                    <div
                      className="poster is-pending"
                      role="group"
                      aria-label={`${project.title} — in progress, coming soon`}
                      data-tone={tone}
                      data-anim
                    >
                      {face}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

        </div>

        {/* The reading for the rack sits beside it rather than above it. */}
        <div className="work-aside">
          <h2 className="eyebrow" data-micro data-anim>
            <span className="eyebrow-rule" aria-hidden="true" />
            Selected work
          </h2>

          <p className="work-lede" data-anim>
            This is the work.
          </p>

          <p className="section-aside" data-micro data-anim>
            Five builds, each one made end to end — the interface, the motion
            and the code underneath it, from front-end studies to full-stack
            products.
          </p>

          <p className="section-aside" data-micro data-anim>
            Open one and its drawing is made on the spot, line by line.
          </p>

          <p className="section-count" data-micro data-anim>
            ({String(PROJECTS.length).padStart(2, "0")})
          </p>
        </div>
      </div>
    </section>
  );
}
