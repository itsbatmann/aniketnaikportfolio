"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const played = useRef(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [stack] = q(".stack");
      const [wordmark] = q(".wordmark");
      const [crescent] = q(".crescent");
      const micro = q("[data-micro]");

      // The CSS hides these until JS is ready; make them the end state of every
      // `from` tween below before any tween reads it.
      gsap.set([wordmark, crescent, ...micro], { autoAlpha: 1 });

      // Size the lockup from the font that actually loaded, rather than from a
      // hard-coded vw value tuned to one typeface.
      // The wordmark's share of the viewport width — wider on phones, where
      // there is no room for the margin notes that flank it on desktop.
      const share = () => (window.innerWidth <= 760 ? 0.74 : 0.64);
      const fit = () => {
        const hero = root.current;
        if (!hero) return;
        const TARGET = share();
        const cs = getComputedStyle(hero);
        const inner =
          hero.clientWidth -
          parseFloat(cs.paddingLeft) -
          parseFloat(cs.paddingRight);
        const target = Math.min(inner, window.innerWidth * TARGET);
        const probe = 100;
        stack.style.setProperty("--fs", `${probe}px`);
        const natural = wordmark.getBoundingClientRect().width;
        if (!natural) {
          stack.style.removeProperty("--fs");
          return;
        }
        stack.style.setProperty("--fs", `${(probe * target) / natural}px`);
      };

      fit();
      document.fonts.ready.then(fit);
      const ro = new ResizeObserver(fit);
      ro.observe(document.documentElement);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => ro.disconnect();
      }

      // The name — every letter rises out of its own mask.
      SplitText.create(wordmark, {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit(self) {
          const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            onComplete: () => {
              played.current = true;
            },
          });

          tl.from(self.chars, {
            yPercent: 115,
            duration: 1.5,
            stagger: 0.06,
          })
            // The crescent swings in behind the first letter.
            .from(
              crescent,
              {
                autoAlpha: 0,
                scale: 0.72,
                rotate: -26,
                transformOrigin: "60% 60%",
                duration: 1.6,
                ease: "power3.out",
              },
              0.65,
            )
            // Everything set in micro type settles afterwards.
            .from(
              micro,
              {
                autoAlpha: 0,
                y: 12,
                duration: 1,
                stagger: 0.07,
                ease: "power2.out",
              },
              0.9,
            );

          if (played.current) tl.progress(1);
          return tl;
        },
      });

      // The lockup drifts a little under the pointer.
      const xTo = gsap.quickTo(stack, "x", { duration: 0.9, ease: "power3" });
      const yTo = gsap.quickTo(stack, "y", { duration: 0.9, ease: "power3" });
      const cxTo = gsap.quickTo(crescent, "x", { duration: 1.4, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        xTo(dx * 22);
        yTo(dy * 12);
        cxTo(dx * -30);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        ro.disconnect();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="hero"
      aria-label="Introduction"
      data-ground="amber"
    >
      <p className="edition" data-micro data-anim>
        folio edition
      </p>

      <div className="stack">
        <h1 className="lockup">
          {/* The lockup reads "Aniket" by design. An h1 of one first name
              tells a crawler nothing, so the full name and role are carried
              here and hidden visually — same words a sighted visitor gets
              from the lockup plus the bio below it. */}
          <span className="sr-only">
            Aniket Naik — UI/UX designer and full-stack web developer
          </span>
          <span className="crescent" aria-hidden="true" data-anim>
            <svg viewBox="0 0 100 100" focusable="false">
              <path
                fillRule="evenodd"
                d="M50 1a49 49 0 1 0 0 98 49 49 0 1 0 0-98Zm13 9a40 40 0 1 1 0 80 40 40 0 1 1 0-80Z"
              />
            </svg>
          </span>
          <span className="wordmark" aria-hidden="true" data-anim>
            Aniket
          </span>
          <span className="tally" data-micro data-anim>
            (26)
          </span>
        </h1>
      </div>

      <p className="bio" data-micro data-anim>
        <span>
          UI/UX designer and full-stack web developer living and working in
          India.
        </span>
        <span>
          A big passion for interfaces, motion, typography and the web that
          holds them.
        </span>
      </p>

      <a className="scroll-cue" href="#work" data-micro data-anim>
        <span>Selected work</span>
        <svg viewBox="0 0 12 28" aria-hidden="true" focusable="false">
          <path
            d="M6 0v24M1 19l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <div className="plinth" aria-hidden="true">
        <span />
        <span />
      </div>
    </section>
  );
}
