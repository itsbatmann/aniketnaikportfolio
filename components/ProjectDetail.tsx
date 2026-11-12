"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import type { Project } from "@/lib/projects";
import ProjectMotif from "./ProjectMotif";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, SplitText);

export default function ProjectDetail({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [title] = q(".case-title");
      const rest = q("[data-micro]");
      const strokes = q(".case-motif .motif path, .case-motif .motif circle");

      gsap.set([title, ...rest], { autoAlpha: 1 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      SplitText.create(title, {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 115,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.04,
          }),
      });

      gsap.from(rest, {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.25,
      });

      gsap.from(strokes, {
        drawSVG: "0%",
        duration: 1.3,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ".case-motif", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <article ref={root} className="case" data-ground="chalk">
      <Link href="/#work" className="nav-link case-back" data-micro data-anim>
        ← Work
      </Link>

      <header className="case-head">
        <p className="case-no" data-micro data-anim>
          {project.no} / {project.scope}
        </p>
        <h1 className="case-title" data-anim>
          {project.title}
        </h1>
        <p className="case-line" data-micro data-anim>
          {project.line}
        </p>
      </header>

      <div className="case-motif" data-micro data-anim>
        <ProjectMotif motif={project.motif} />
      </div>

      <div className="case-body">
        <dl className="case-meta" data-micro data-anim>
          <div>
            <dt>Scope</dt>
            <dd>{project.scope}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.join(", ")}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status ?? "Complete"}</dd>
          </div>
        </dl>

        <div className="case-copy" data-micro data-anim>
          {project.overview.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}

          <ul className="case-highlights">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {project.href || project.repo ? (
            <p className="case-links">
              {project.href ? (
                <a className="nav-link" href={project.href} target="_blank" rel="noreferrer">
                  Live site ↗
                </a>
              ) : null}
              {project.repo ? (
                <a className="nav-link" href={project.repo} target="_blank" rel="noreferrer">
                  Repository ↗
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>

      <Link href={`/work/${next.slug}`} className="case-next" data-micro data-anim>
        <span className="eyebrow">Next project</span>
        <span className="case-next-title">{next.title}</span>
        <span className="case-next-meta">
          {next.no} — {next.scope}
        </span>
      </Link>
    </article>
  );
}
