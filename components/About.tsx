"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// ── Content ──────────────────────────────────────────────────────────────
// Everything a human needs to edit lives here.
const NAME = { first: "Aniket", last: "Naik" };
const META = ["04/03/2005", "Mumbai, India"];

// The portrait: a cut-out with a transparent ground, so the figure stands on
// the page rather than inside a photo box. Source file lives in /Assets.
const PORTRAIT = "/portrait.png";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [lockup] = q(".about-lockup");
      const [body] = q(".about-body");
      const [portrait] = q(".about-portrait");
      const [signoff] = q(".about-signoff");
      const rules = q(".about-rule");
      const rest = q("[data-micro]");

      // CSS hides these until JS runs; this is the end state of every tween.
      gsap.set([lockup, body, portrait, signoff, ...rules, ...rest], {
        autoAlpha: 1,
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // This section is the second screen of the home page, so nothing here
      // plays on load — each part reveals as the section comes up. A
      // ScrollTrigger whose start is already behind us never fires, though,
      // so if the page is opened part-way down the reveal simply runs.
      const inView =
        !root.current ||
        root.current.getBoundingClientRect().top < window.innerHeight * 0.62;
      const reveal = inView
        ? undefined
        : ({ trigger: root.current, start: "top 62%", once: true } as const);

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: reveal,
      });

      // The hairlines draw themselves across the page first.
      tl.from(rules, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.inOut",
      });

      SplitText.create(lockup, {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit(self) {
          return tl.from(
            self.chars,
            {
              yPercent: 115,
              duration: 1.3,
              stagger: 0.05,
            },
            0.15,
          );
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
            delay: 0.45,
            scrollTrigger: reveal,
          });
        },
      });

      // The sign-off is written on by a sweeping mask, the same hand the
      // home lockup is set in.
      gsap.fromTo(
        signoff,
        { "--wipe": 100 },
        {
          "--wipe": 0,
          duration: 1.8,
          ease: "power1.inOut",
          delay: 0.9,
          scrollTrigger: reveal,
        },
      );

      gsap.from(rest, {
        autoAlpha: 0,
        y: 14,
        duration: 0.9,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.5,
        scrollTrigger: reveal,
      });

      gsap.from(portrait, {
        autoAlpha: 0,
        yPercent: 6,
        duration: 1.6,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: reveal,
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      className="about"
      aria-label="About"
      data-ground="paper"
    >
      <header className="about-head">
        <p className="about-index" data-micro data-anim>
          About
        </p>
        <span className="about-rule" aria-hidden="true" data-anim />
        <p className="about-years" data-micro data-anim>
          Designer &amp; developer
        </p>
      </header>

      <div className="about-text">
        <h2 className="about-lockup" data-anim>
          <span className="about-first">{NAME.first}</span>{" "}
          <span className="about-last">{NAME.last}</span>
        </h2>

        <p className="about-meta" data-micro data-anim>
          {META.map((item, i) => (
            <span key={item}>
              {i > 0 ? <i aria-hidden="true">/</i> : null}
              <span>{item}</span>
            </span>
          ))}
        </p>

        <span className="about-rule" aria-hidden="true" data-anim />

        <p className="about-body" data-anim>
          I&rsquo;m a part-time designer and a full-time developer.
          <br />
          I build the whole thing: the interface, the motion, and the code
          underneath it.
          <br />
          My work defines who I am. Every project here began as something I
          wanted to exist, and I stayed up until it did.
          <br />
          I finished my bachelor&rsquo;s at DG Ruparel College of Arts,
          Commerce and Science in May 2026; everything else I taught myself.
        </p>

        <p className="about-signoff" data-anim>
          Built from late nights and loud thoughts.
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
