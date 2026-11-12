"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const NAV = [
  { label: "Work", href: "/#work", marked: true },
  { label: "About", href: "/about" },
  { label: "Hello", href: "/#hello" },
];

const SOCIALS = [
  { label: "Insta", href: "https://instagram.com/" },
  { label: "Lin", href: "https://linkedin.com/" },
  { label: "Git", href: "https://github.com/" },
];

export default function SiteNav() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const nav = root.current;
      if (!nav) return;

      gsap.to(nav, { autoAlpha: 1, duration: 0.8, delay: 0.15, ease: "power2.out" });

      // The display face lands after first paint and reflows the page, so the
      // scroll positions every trigger measured need taking again.
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      // The bar has no backdrop, so rather than let it sit on top of large
      // type it leaves on the way down and comes back on the way up.
      let hidden = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const shouldHide = self.direction === 1 && self.scroll() > 160;
          if (shouldHide === hidden) return;
          hidden = shouldHide;
          gsap.to(nav, {
            yPercent: shouldHide ? -220 : 0,
            autoAlpha: shouldHide ? 0 : 1,
            duration: 0.5,
            ease: "power3.out",
          });
        },
      });

      // In-page jumps are animated here rather than with CSS smooth scrolling,
      // which would also intercept the router's own scroll reset between pages.
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
        const link = (e.target as HTMLElement)?.closest?.("a[href]");
        if (!(link instanceof HTMLAnchorElement)) return;

        const url = new URL(link.href, window.location.href);
        if (url.pathname !== window.location.pathname || !url.hash) return;

        const target = document.querySelector(url.hash);
        if (!target) return;

        e.preventDefault();
        history.pushState(null, "", url.hash);
        gsap.to(window, {
          duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 0
            : 1.1,
          ease: "power3.inOut",
          scrollTo: { y: target as HTMLElement, autoKill: true },
        });
      };

      document.addEventListener("click", onClick);

      // Each section declares the ink its ground needs; the bar picks it up as
      // the section passes under it, so one fixed bar reads on every ground.
      const sections = gsap.utils.toArray<HTMLElement>("[data-ground]");
      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 42px",
          end: "bottom 42px",
          onToggle: (self) => {
            if (!self.isActive) return;
            nav.style.setProperty(
              "--nav-ink",
              section.dataset.navInk === "light"
                ? "var(--chalk)"
                : "var(--ink)",
            );
          },
        });
      });

      return () => document.removeEventListener("click", onClick);
    },
    { scope: root, dependencies: [pathname] },
  );

  return (
    <header ref={root} className="sitenav" data-anim>
      <nav className="nav" aria-label="Primary">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={item.marked ? "nav-link is-marked" : "nav-link"}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link href="/" className="nav-mark" aria-label="Home">
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <g
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M50 4V96" />
            <path d="M10 27L90 73" />
            <path d="M10 73L90 27" />
          </g>
        </svg>
      </Link>

      <ul className="socials">
        {SOCIALS.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="nav-link"
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
