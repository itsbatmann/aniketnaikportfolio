"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, SplitText);

/**
 * `art` is the user's mandala, traced into strokes and inlined by a server
 * component (MandalaArt), so DrawSVGPlugin can draw it here contour by
 * contour. The file lists the contours nearest the centre first, so a plain
 * stagger draws it from the middle out.
 */
export default function Interlude({ art }: { art: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [lede] = q(".interlude-lede");
      const [body] = q(".interlude-body");
      const [mandala] = q(".interlude-mandala");
      const strokes = q(".interlude-mandala .lines path");
      const [ink] = q(".interlude-mandala .ink");
      const micro = q("[data-micro]");

      gsap.set([lede, body, ...micro], { autoAlpha: 1 });
      // The drawing keeps the opacity the stylesheet gives it, so only its
      // visibility is switched on. Centred on its own box by GSAP, not CSS
      // translate (GSAP folds that into its transform and loses the
      // percentage). The traced image is already cut at the mandala's
      // centre on its right side, so it sits flush to the section's edge.
      gsap.set(mandala, { visibility: "visible", yPercent: -50 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // See the note in About: a trigger that is already behind us never
      // fires, so a section that is already on screen reveals straight away.
      const inView =
        !root.current ||
        root.current.getBoundingClientRect().top < window.innerHeight * 0.7;
      const reveal = inView
        ? undefined
        : ({ trigger: root.current, start: "top 70%", once: true } as const);

      SplitText.create(lede, {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 115,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.035,
            scrollTrigger: reveal,
          }),
      });

      SplitText.create(body, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            ease: "expo.out",
            stagger: 0.06,
            delay: 0.3,
            scrollTrigger: reveal,
          }),
      });

      gsap.from(micro, {
        autoAlpha: 0,
        y: 12,
        duration: 0.9,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.5,
        scrollTrigger: reveal,
      });

      // Drawn with DrawSVG from the centre out, outline first; then the ink
      // fills in behind the lines and the lines themselves fade, so what is
      // left is the solid drawing. The stagger is spread over the whole set
      // rather than fixed per stroke, so it takes the same few seconds
      // however many contours the trace produced.
      if (strokes.length && ink) {
        gsap.set(strokes, { drawSVG: "0%" });
        gsap.set(ink, { fillOpacity: 0 });
        gsap
          .timeline({ delay: 0.2, scrollTrigger: reveal })
          .to(strokes, {
            drawSVG: "100%",
            duration: 1.1,
            ease: "power1.inOut",
            stagger: { amount: 3.6 },
          })
          .to(ink, { fillOpacity: 1, duration: 1.6, ease: "power2.inOut" }, "-=1.4")
          .to(strokes, { strokeOpacity: 0, duration: 0.9 }, "<0.5");
      }

      // Then it drifts a few percent against the text as the page passes.
      gsap.fromTo(
        mandala,
        { yPercent: -46 },
        {
          yPercent: -54,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="craft"
      className="interlude"
      aria-label="About this site"
      data-ground="paper"
    >
      {art}

      <div className="interlude-text">
        <p className="eyebrow" data-micro data-anim>
          <span className="eyebrow-rule" aria-hidden="true" />
          About this site
        </p>

        <h2 className="interlude-lede" data-anim>
          Made by hand.
        </h2>

        <p className="interlude-body" data-anim>
          Every part of this portfolio was designed and built from scratch
          &mdash; the lettering, the motion, the drawings in the margins and
          the code underneath. Nothing here came from a template.
        </p>

        {/* What it is built with — this site, and the rest of the work. */}
        <p className="interlude-note" data-micro data-anim>
          <span className="interlude-note-label">Works in</span>
          React · Next.js · GSAP · Framer Motion · Node · Express · MongoDB ·
          PostgreSQL · SQL · Java · Python
        </p>
      </div>
    </section>
  );
}
