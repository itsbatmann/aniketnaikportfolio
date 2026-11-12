"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [copy] = q(".statement-copy");
      const meta = q("[data-micro]");

      gsap.set([copy, ...meta], { autoAlpha: 1 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      SplitText.create(copy, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: {
              trigger: copy,
              start: "top 78%",
              once: true,
            },
          });
        },
      });

      gsap.from(meta, {
        autoAlpha: 0,
        y: 14,
        duration: 0.9,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="statement"
      aria-label="Approach"
      data-ground="chalk"
    >
      <p className="eyebrow" data-micro data-anim>
        <span className="eyebrow-rule" aria-hidden="true" />
        Approach
      </p>

      <p className="statement-copy" data-anim>
        I design and build the whole thing — the interface, the motion and the
        code underneath it. Quiet layouts, deliberate type, and the kind of
        detail you only notice on the second visit.
      </p>

      <dl className="facts" data-micro data-anim>
        <div>
          <dt>Design</dt>
          <dd>UI/UX, design systems, art direction</dd>
        </div>
        <div>
          <dt>Build</dt>
          <dd>Next.js, React, GSAP, APIs</dd>
        </div>
        <div>
          <dt>Based</dt>
          <dd>India — working remotely</dd>
        </div>
      </dl>
    </section>
  );
}
