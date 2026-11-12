"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Placeholder contact details — swap these for the real ones.
const EMAIL = "hello@aniketnaik.com";
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "GitHub", href: "https://github.com/" },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [headline] = q(".contact-headline");
      const rest = q("[data-micro]");

      gsap.set([headline, ...rest], { autoAlpha: 1 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      SplitText.create(headline, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: headline, start: "top 82%", once: true },
          });
        },
      });

      gsap.from(rest, {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 62%", once: true },
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
      data-ground="ink"
      data-nav-ink="light"
    >
      <p className="eyebrow" data-micro data-anim>
        <span className="eyebrow-rule" aria-hidden="true" />
        Hello
      </p>

      <p className="contact-headline" data-anim>
        Have something worth building? I take on a small number of projects at
        a time.
      </p>

      <a className="contact-email" href={`mailto:${EMAIL}`} data-micro data-anim>
        <span>{EMAIL}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M6 18L18 6M9 6h9v9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <div className="contact-foot" data-micro data-anim>
        <ul className="contact-socials">
          {SOCIALS.map((item) => (
            <li key={item.label}>
              <a
                className="nav-link"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="colophon">
          Designed &amp; built by Aniket Naik — Bodoni Moda &amp; GSAP
        </p>
        <p className="colophon">&copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
