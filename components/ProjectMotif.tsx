import type { Motif } from "@/lib/projects";

/**
 * One line drawing per project. Everything is a stroked path so GSAP's
 * DrawSVGPlugin can draw it on, and so it inherits whatever ink the
 * surrounding section is set in.
 */
export default function ProjectMotif({
  motif,
  className,
}: {
  motif: Motif;
  className?: string;
}) {
  return (
    <svg
      className={className ? `motif ${className}` : "motif"}
      viewBox="0 0 120 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {motif === "car" ? (
        <g>
          <path d="M14 54h92" />
          <path d="M26 54c0-14 10-24 24-26 12-2 22 2 30 8 6 4 12 8 20 10" />
          <path d="M50 28c8-4 18-4 26 0" />
          <circle cx="44" cy="54" r="9" />
          <circle cx="86" cy="54" r="9" />
          <path d="M6 40h16M2 47h14M10 33h10" />
        </g>
      ) : null}

      {motif === "web" ? (
        <g>
          <path d="M60 40L60 4M60 40L91.7 10.9M60 40L111.4 28.9M60 40L111.4 51.1M60 40L91.7 69.1M60 40L60 76M60 40L28.3 69.1M60 40L8.6 51.1M60 40L8.6 28.9M60 40L28.3 10.9" />
          <path d="M60 31.4Q63.6 32.5 67.6 33Q69.5 35.4 72.3 37.3Q71.8 40 72.3 42.7Q69.5 44.6 67.6 47Q63.6 47.5 60 48.6Q56.4 47.5 52.4 47Q50.5 44.6 47.7 42.7Q48.2 40 47.7 37.3Q50.5 35.4 52.4 33Q56.4 32.5 60 31.4Z" />
          <path d="M60 24.9Q66.4 26.9 73.3 27.8Q76.7 31.9 81.6 35.3Q80.6 40 81.6 44.7Q76.7 48.1 73.3 52.2Q66.4 53.1 60 55.1Q53.6 53.1 46.7 52.2Q43.3 48.1 38.4 44.7Q39.4 40 38.4 35.3Q43.3 31.9 46.7 27.8Q53.6 26.9 60 24.9Z" />
          <path d="M60 18.4Q69.1 21.3 79 22.5Q83.8 28.5 90.8 33.3Q89.4 40 90.8 46.7Q83.8 51.5 79 57.5Q69.1 58.7 60 61.6Q50.9 58.7 41 57.5Q36.2 51.5 29.2 46.7Q30.6 40 29.2 33.3Q36.2 28.5 41 22.5Q50.9 21.3 60 18.4Z" />
          <path d="M60 11.9Q71.8 15.7 84.8 17.3Q91 25 100.1 31.3Q98.3 40 100.1 48.7Q91 55 84.8 62.7Q71.8 64.3 60 68.1Q48.2 64.3 35.2 62.7Q29 55 19.9 48.7Q21.7 40 19.9 31.3Q29 25 35.2 17.3Q48.2 15.7 60 11.9Z" />
          <path d="M60 5.4Q74.6 10.1 90.5 12Q98.1 21.5 109.3 29.3Q107.1 40 109.3 50.7Q98.1 58.5 90.5 68Q74.6 69.9 60 74.6Q45.4 69.9 29.5 68Q21.9 58.5 10.7 50.7Q12.9 40 10.7 29.3Q21.9 21.5 29.5 12Q45.4 10.1 60 5.4Z" />
        </g>
      ) : null}

      {motif === "grid" ? (
        <g>
          <path d="M16 64h88M16 64V12" />
          <path d="M30 64V46M48 64V32M66 64V38M84 64V22" />
          <path d="M30 40l18-16 18 8 18-18" />
          <circle cx="30" cy="40" r="2.6" />
          <circle cx="48" cy="24" r="2.6" />
          <circle cx="66" cy="32" r="2.6" />
          <circle cx="84" cy="14" r="2.6" />
        </g>
      ) : null}

      {motif === "lamp" ? (
        <g>
          {/* A table lamp: shade, stem, base, and the light falling from it. */}
          <path d="M44 12h32l12 28H32Z" />
          <path d="M60 40v24" />
          <path d="M46 71c0-4 6-6 14-6s14 2 14 6Z" />
          <path d="M28 47l-8 5M92 47l8 5M46 49l-4 8M74 49l4 8" />
        </g>
      ) : null}

      {motif === "cup" ? (
        <g>
          <circle cx="56" cy="44" r="24" />
          <circle cx="56" cy="44" r="16" />
          <path d="M80 36c7-2 12 1 12 7s-5 10-12 10" />
          <path d="M18 72h76" />
          <path className="smoke" d="M46 20c-6-4 6-8 0-12" />
          <path className="smoke" d="M58 20c-6-4 6-8 0-12" />
          <path className="smoke" d="M70 20c-6-4 6-8 0-12" />
        </g>
      ) : null}
    </svg>
  );
}
