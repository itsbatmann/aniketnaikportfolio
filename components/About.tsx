"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

// ── Content ──────────────────────────────────────────────────────────────
// Everything a human needs to edit lives here. The three meta items are the
// reference's `age . date of birth . city` rhythm — swap them for the real
// ones; they are only placeholders.
const NAME = { first: "Aniket", last: "Naik" };
const META = ["26", "06/04/2000", "KANNUR"];

// The portrait. Drop a cut-out (transparent or flat-ground) photo at this
// path in /public. Until it exists the frame renders as a tonal block, so a
// missing file never leaves a broken-image icon on the page.
const PORTRAIT = "/portrait.png";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [lockup] = q(".about-lockup");
      const [body] = q(".about-body");
      const [portrait] = q(".about-portrait");
      const rest = q("[data-micro]");

      // CSS hides these until JS runs; this is the end state of every tween.
      gsap.set([lockup, body, portrait, ...rest], { autoAlpha: 1 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      SplitText.create(lockup, {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit(self) {
          return tl.from(self.chars, {
            yPercent: 115,
            duration: 1.3,
            stagger: 0.05,
          });
        },
      });

      SplitText.create(body, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            ease: "expo.out",
            stagger: 0.055,
            delay: 0.35,
          });
        },
      });

      gsap.from(rest, {
        autoAlpha: 0,
        y: 14,
        duration: 0.9,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.5,
      });

      gsap.from(portrait, {
        autoAlpha: 0,
        yPercent: 6,
        duration: 1.6,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="about" data-ground="chalk">
      <div className="about-text">
        <h1 className="about-lockup" data-anim>
          <span className="about-first">{NAME.first}</span>{" "}
          <span className="about-last">{NAME.last}</span>
        </h1>

        <p className="about-meta" data-micro data-anim>
          {META.map((item, i) => (
            <span key={item}>
              {i > 0 ? <i aria-hidden="true">.</i> : null}
              <span className={i === 1 ? "is-flare" : undefined}>{item}</span>
            </span>
          ))}
        </p>

        <p className="about-body" data-anim>
          I didn&rsquo;t start in design.
          <br />
          I moved through different jobs, different paths, different versions of
          myself
          <br />
          but none of them felt real.
          <br />
          <em className="is-flare">Design</em> was the first thing that gave me
          both <em className="is-flare">obsession and peace</em>.
          <br />
          I learned the rules, broke them, taught myself everything I could, and
          slowly built my own visual language.
          <br />
          Now, with <em className="is-flare">more than 2 years of experience</em>{" "}
          in design, I continue to shape ideas into meaningful visual
          experiences.
          <br />
          Today, every project you see here is part of the world I dreamed of
          creating.
        </p>

        <p className="about-signoff" data-micro data-anim>
          Built from <span className="is-flare">late nights</span> and{" "}
          <span className="is-flare">loud thoughts.</span>
        </p>
      </div>

      <figure
        className="about-portrait"
        data-anim
        style={{ "--portrait": `url(${PORTRAIT})` } as React.CSSProperties}
      >
        <span className="about-portrait-img" role="img" aria-label="Portrait" />
      </figure>
    </section>
  );
}
