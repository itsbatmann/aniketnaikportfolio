"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

/**
 * No markup of its own. The site has no navigation bar — every section is
 * reached by scrolling, and the links live in the footer — but the in-page
 * jumps that remain (the hero's cue, the footer's links) still want easing.
 * It is animated here rather than with CSS smooth scrolling, which would also
 * intercept the router's own scroll reset between pages.
 */
export default function SmoothScroll() {
  const ref = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      // The display faces land after first paint and reflow the page, so the
      // scroll positions every trigger measured need taking again.
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey)
          return;
        const link = (e.target as HTMLElement)?.closest?.("a[href]");
        if (!(link instanceof HTMLAnchorElement)) return;

        const url = new URL(link.href, window.location.href);
        if (url.pathname !== window.location.pathname || !url.hash) return;

        const target = document.querySelector(url.hash);
        if (!target) return;

        e.preventDefault();
        history.pushState(null, "", url.hash);
        gsap.to(window, {
          duration: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? 0
            : 1.1,
          ease: "power3.inOut",
          scrollTo: { y: target as HTMLElement, autoKill: true },
        });
      };

      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    },
    { scope: ref, dependencies: [pathname] },
  );

  return <span ref={ref} hidden aria-hidden="true" />;
}
