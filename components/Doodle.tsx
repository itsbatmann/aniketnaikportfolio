"use client";

import gsap from "gsap";

/**
 * The marginalia. One hand across the whole site: stick figures drawn in a
 * single weight of line, the way you would sketch them next to a note.
 *
 * Each drawing is sketched on with DrawSVGPlugin (`.doodle-lines > *` is the
 * handle for that) and then kept alive by `animateDoodle`, which knows which
 * limb of which figure moves. They all share one 126 × 118 box.
 */

export type DoodleKind =
  | "skate"
  | "run"
  | "swim"
  | "box"
  | "cycle"
  | "coffee"
  | "chill";

type Stroke = { d: string; cls?: string };
type Dot = { cx: number; cy: number; r: number; cls?: string };

/** A part that moves as one piece — a forearm with the cup still in it. */
type Group = { cls: string; lines: Stroke[]; dots?: Dot[] };

type Drawing = {
  lines: Stroke[];
  dots?: Dot[];
  groups?: Group[];
  /** The speed, the water, the impact — whatever moves around the figure. */
  speed?: string[];
  label: string;
};

const DRAWINGS: Record<DoodleKind, Drawing> = {
  // On a board, leaning into it.
  skate: {
    lines: [
      { d: "M30 99c24 6 62 6 88 0" },
      { d: "M46 101v5" },
      { d: "M108 101v5" },
      { d: "M79 60 61 83l-11 14" },
      { d: "M79 60l17 21 10 16" },
      { d: "M79 60l7-27" },
      { d: "M85 41l20-9 11 7" },
      { d: "M84 43l-19-6-9 8" },
    ],
    dots: [
      { cx: 90, cy: 25, r: 9 },
      { cx: 46, cy: 108, r: 7 },
      { cx: 108, cy: 108, r: 7 },
    ],
    speed: ["M6 62h19", "M1 77h22", "M12 90h14"],
    label: "Skating",
  },

  // Mid-stride. The limbs swing from the hip and the shoulder.
  run: {
    lines: [
      { d: "M74 58 94 74l-4 24", cls: "part-leg-a" },
      { d: "M74 58 54 68l-14-9", cls: "part-leg-b" },
      { d: "M74 58l8-26" },
      { d: "M80 40l19 7 6-12", cls: "part-arm-a" },
      { d: "M78 42l-18-5-7 10", cls: "part-arm-b" },
      { d: "M30 100h62" },
    ],
    dots: [{ cx: 88, cy: 24, r: 9 }],
    speed: ["M4 64h20", "M0 78h16", "M10 90h14"],
    label: "Running",
  },

  // Front crawl. The raised arm turns through the whole stroke, and the water
  // runs past underneath — the wave is drawn long so it can scroll.
  swim: {
    lines: [
      { d: "M44 66 88 58" },
      { d: "M72 60 92 42l14-8", cls: "part-stroke" },
      { d: "M58 64 44 52" },
      { d: "M44 66 24 72" },
      { d: "M44 66 26 60" },
      {
        d: "M-30 88c10-7 18 7 28 0s18 7 28 0 18 7 28 0 18 7 28 0 18 7 28 0 18 7 28 0",
        cls: "part-wave",
      },
    ],
    dots: [{ cx: 96, cy: 54, r: 8 }],
    speed: ["M100 24h12", "M110 34h10"],
    label: "Swimming",
  },

  // Guard up. The right hand goes out and comes back.
  box: {
    lines: [
      { d: "M62 56 78 78l6 14" },
      { d: "M62 56 48 76l-6 16" },
      { d: "M62 56l4-22" },
      { d: "M66 44 86 46", cls: "part-punch" },
      { d: "M62 47 51 41" },
      { d: "M28 98h66" },
    ],
    dots: [
      { cx: 66, cy: 25, r: 9 },
      { cx: 94, cy: 47, r: 7, cls: "part-glove" },
      { cx: 45, cy: 44, r: 6 },
    ],
    speed: ["M107 37l9-5", "M109 47h11", "M107 57l9 5"],
    label: "Boxing",
  },

  // Off the clock entirely: sat on the floor, leaning back on one arm, and
  // every few seconds the cup goes up for a sip.
  chill: {
    lines: [
      { d: "M12 98h102" },
      // leaning back: hips to shoulders
      { d: "M58 88 47 61" },
      // the arm he is propped on
      { d: "M47 63 33 79l-6 17" },
      // the near leg, stretched out; the far one, knee up
      { d: "M58 88 84 95l8 2" },
      { d: "M58 88 71 73l9 22" },
      // upper arm, out to the elbow the cup swings from
      { d: "M49 63 62 72" },
    ],
    dots: [{ cx: 42, cy: 50, r: 9 }],
    groups: [
      {
        cls: "part-sip",
        lines: [
          // forearm
          { d: "M62 72 70 62" },
          // a paper cup, tapered, with its lid
          { d: "M67 47h13l-2 13h-9z" },
          { d: "M65 45h17" },
          { d: "M70 38c-4-3 4-5 0-9", cls: "part-steam" },
          { d: "M77 38c-4-3 4-5 0-9", cls: "part-steam" },
        ],
      },
    ],
    label: "Sitting with a drink",
  },

  // Off the clock: stood with a coffee, and every few seconds it goes up
  // for a sip.
  coffee: {
    lines: [
      { d: "M54 54 47 80l-2 17" },
      { d: "M54 54 62 78l2 19" },
      { d: "M54 54l3-20" },
      // the free hand, in a pocket
      { d: "M52 50 42 57l2 9" },
      // upper arm, out to the elbow the cup swings from
      { d: "M56 48 68 56" },
      { d: "M26 98h70" },
    ],
    dots: [{ cx: 57, cy: 24, r: 9 }],
    groups: [
      {
        cls: "part-sip",
        lines: [
          { d: "M68 56 74 45" },
          { d: "M69 31h12l-2 13h-8z" },
          { d: "M67 29h16" },
          { d: "M72 23c-4-3 4-5 0-9", cls: "part-steam" },
          { d: "M79 23c-4-3 4-5 0-9", cls: "part-steam" },
        ],
      },
    ],
    label: "Standing with a coffee",
  },

  // Out on the bike, pedalling.
  cycle: {
    lines: [
      { d: "M32 94 62 94 80 66 98 94" },
      { d: "M62 94 56 64" },
      { d: "M56 64 80 66" },
      { d: "M80 66 89 61" },
      { d: "M56 62 63 44" },
      { d: "M61 48 79 63" },
      { d: "M56 62 64 80", cls: "part-leg-a" },
      { d: "M56 62 52 80", cls: "part-leg-b" },
      { d: "M32 86v16", cls: "part-spoke-a" },
      { d: "M98 86v16", cls: "part-spoke-b" },
    ],
    dots: [
      { cx: 32, cy: 94, r: 14 },
      { cx: 98, cy: 94, r: 14 },
      { cx: 66, cy: 33, r: 8 },
    ],
    speed: ["M2 62h16", "M6 76h12"],
    label: "Cycling",
  },
};

/**
 * Starts the loop that keeps a drawing moving once it has been sketched on.
 * Pass the element the drawing sits in.
 */
export function animateDoodle(root: Element, kind: DoodleKind) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const pick = (sel: string) => root.querySelector(sel);
  const speed = root.querySelectorAll(".doodle-speed");

  if (kind === "swim") {
    // The arm turns through the stroke: over the water, and back under it.
    gsap.to(pick(".part-stroke"), {
      rotation: 360,
      svgOrigin: "72 60",
      duration: 2.6,
      repeat: -1,
      ease: "none",
    });
    // The water runs past. One wave length is 56 units, so it loops seamlessly.
    gsap.fromTo(
      pick(".part-wave"),
      { x: 0 },
      { x: 56, duration: 2.4, repeat: -1, ease: "none" },
    );
    gsap.to(root, {
      y: -5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return;
  }

  if (kind === "box") {
    // A real jab: the forearm extends from the elbow and the glove rides out
    // on the end of it, rather than the whole arm sliding off the shoulder.
    const arm = pick(".part-punch");
    const glove = pick(".part-glove");
    if (!arm || !glove) return;
    const reach = { x: 86 };
    gsap.to(reach, {
      x: 114,
      duration: 0.14,
      ease: "power3.out",
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.4,
      onUpdate: () => {
        arm.setAttribute("d", `M66 44 ${reach.x} 46`);
        glove.setAttribute("cx", String(reach.x + 8));
      },
    });
    // The impact marks land with the punch.
    gsap.fromTo(
      speed,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.14,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.4,
        stagger: 0.03,
      },
    );
    // And he bounces on his feet between them.
    gsap.to(root, {
      y: -4,
      duration: 0.54,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return;
  }

  if (kind === "chill") {
    // The sip: the forearm swings the cup up to his face, holds, comes back.
    gsap.to(pick(".part-sip"), {
      rotation: -34,
      svgOrigin: "62 72",
      duration: 0.9,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      repeatDelay: 1.6,
    });
    // The steam keeps coming off it.
    gsap.fromTo(
      root.querySelectorAll(".part-steam"),
      { y: 0, opacity: 0.9 },
      {
        y: -8,
        opacity: 0.2,
        duration: 2.1,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.5,
      },
    );
    gsap.to(root, {
      y: -3,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return;
  }

  if (kind === "coffee") {
    // The sip: the forearm swings the cup up to his face, holds, comes back.
    gsap.to(pick(".part-sip"), {
      // Far enough for the cup to reach his mouth, not so far that it sits
      // over his face.
      rotation: -26,
      svgOrigin: "68 56",
      duration: 0.9,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      repeatDelay: 1.7,
    });
    // The steam goes up and thins out; he just breathes.
    gsap.fromTo(
      root.querySelectorAll(".part-steam"),
      { y: 0, opacity: 0.9 },
      {
        y: -9,
        opacity: 0.15,
        duration: 2.2,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.5,
      },
    );
    gsap.to(root, {
      y: -3,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return;
  }

  if (kind === "cycle") {
    gsap.to(pick(".part-leg-a"), {
      rotation: 26,
      svgOrigin: "56 62",
      duration: 0.45,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(pick(".part-leg-b"), {
      rotation: -26,
      svgOrigin: "56 62",
      duration: 0.45,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(pick(".part-spoke-a"), {
      rotation: 360,
      svgOrigin: "32 94",
      duration: 0.9,
      repeat: -1,
      ease: "none",
    });
    gsap.to(pick(".part-spoke-b"), {
      rotation: 360,
      svgOrigin: "98 94",
      duration: 0.9,
      repeat: -1,
      ease: "none",
    });
    gsap.to(speed, {
      opacity: 0.15,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      stagger: 0.12,
      ease: "sine.inOut",
    });
    gsap.to(root, {
      y: -3,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return;
  }

  if (kind === "run") {
    const swing = (sel: string, to: number, origin: string) =>
      gsap.to(pick(sel), {
        rotation: to,
        svgOrigin: origin,
        duration: 0.34,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    swing(".part-leg-a", -26, "74 58");
    swing(".part-leg-b", 26, "74 58");
    swing(".part-arm-a", 22, "79 41");
    swing(".part-arm-b", -22, "79 41");
    gsap.to(root, {
      y: -4,
      duration: 0.34,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
}

export default function Doodle({
  kind,
  className,
  title,
}: {
  kind: DoodleKind;
  className?: string;
  /** Give it a title only where the drawing carries meaning on its own. */
  title?: string;
}) {
  const drawing = DRAWINGS[kind];

  return (
    <svg
      className={className ? `doodle ${className}` : "doodle"}
      viewBox="0 0 126 118"
      role="img"
      aria-label={title ?? drawing.label}
      focusable="false"
    >
      <g
        className="doodle-lines"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {drawing.lines.map((line, i) => (
          <path key={i} className={line.cls} d={line.d} />
        ))}
        {drawing.dots?.map((dot, i) => (
          <circle
            key={`c${i}`}
            className={dot.cls}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
          />
        ))}
        {drawing.groups?.map((group) => (
          <g key={group.cls} className={group.cls}>
            {group.lines.map((line, i) => (
              <path key={i} className={line.cls} d={line.d} />
            ))}
            {group.dots?.map((dot, i) => (
              <circle
                key={`gc${i}`}
                className={dot.cls}
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
              />
            ))}
          </g>
        ))}
        {drawing.speed?.map((d, i) => (
          <path className="doodle-speed" key={`s${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}
