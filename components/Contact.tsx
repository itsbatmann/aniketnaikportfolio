"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Doodle, { animateDoodle } from "./Doodle";
import { SITE } from "@/lib/site";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

// The three come from lib/site.ts, which is the one place to paste them.
const LINKS = [
  { label: "LinkedIn", href: SITE.linkedin },
  { label: "GitHub", href: SITE.github },
  { label: "Email", href: `mailto:${SITE.email}` },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const thanks = q(".contact-thanks, .contact-rule");
      const rest = q("[data-micro]");
      const [figure] = q(".contact-doodle");
      const figureLines = q(
        ".contact-doodle .doodle-lines path, .contact-doodle .doodle-lines circle",
      );

      gsap.set([...thanks, ...rest, figure], { autoAlpha: 1 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // See the note in About: a trigger that is already behind us never
      // fires, so an already-visible footer reveals straight away.
      const inView =
        !root.current ||
        root.current.getBoundingClientRect().top < window.innerHeight * 0.78;
      const reveal = inView
        ? undefined
        : ({ trigger: root.current, start: "top 78%", once: true } as const);

      gsap.from(thanks, {
        autoAlpha: 0,
        y: 28,
        duration: 1.3,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: reveal,
      });

      // Sketched in, then he stands there with his coffee.
      gsap.fromTo(
        figureLines,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 0.4,
          stagger: 0.06,
          ease: "none",
          delay: 0.5,
          scrollTrigger: reveal,
          onComplete: () => animateDoodle(figure, "coffee"),
        },
      );

      gsap.from(rest, {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.25,
        scrollTrigger: reveal,
      });
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      id="hello"
      className="contact"
      aria-label="Contact"
      data-ground="plum"
    >
      <div className="contact-sign">
        <h2 className="contact-thanks" data-anim>
          Thank you
        </h2>
        <p className="contact-rule" aria-hidden="true" data-anim />
      </div>

      {/* Off to one side, taking his time. */}
      <Doodle
        kind="coffee"
        className="contact-doodle"
        title="Standing with a coffee"
      />

      <div className="contact-foot">
        <ul className="contact-links" data-micro data-anim>
          {LINKS.map((item) => (
            <li key={item.label}>
              <a
                className="nav-link"
                href={item.href}
                {...(item.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noreferrer" })}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="colophon" data-micro data-anim>
          &copy; {new Date().getFullYear()} Aniket Naik
        </p>
      </div>
    </footer>
  );
}
