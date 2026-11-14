"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Doodle from "./Doodle";
import { SIGNATURE, WORDMARK, type Lockup } from "@/lib/lockup";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

// Roughly how many particles the lockup is built from. The sampling rate is
// solved from this, so the count holds steady across screen sizes.
const PARTICLE_BUDGET = 9000;

// The run of the animation, in seconds.
const STAR = 0.9; // the star's flight, before it breaks
const SPREAD = 0.5; // how long the particles keep leaving the burst
const FLIGHT = 1.15; // how long one particle takes to find its place
const SETTLED = STAR + SPREAD + FLIGHT;

type Particle = {
  /** Where this particle belongs in the finished lockup. */
  hx: number;
  hy: number;
  /** Where it was thrown when the star broke. */
  sx: number;
  sy: number;
  x: number;
  y: number;
  delay: number;
  dur: number;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const hero = root.current;
      if (!hero) return;

      const q = gsap.utils.selector(root);
      const [canvas] = q<HTMLCanvasElement>("canvas.lockup-canvas");
      const [stack] = q(".stack");
      const [skater] = q(".skater");
      const skaterLines = q(".skater .doodle-lines path, .skater .doodle-lines circle");
      const words = q<SVGSVGElement>(".lockup-draw");
      const micro = q("[data-micro]");

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.set(micro, { autoAlpha: 1 });

      // Without motion the lockup and the skater are simply set on the page.
      if (reduced) {
        gsap.set([...words, skater], { autoAlpha: 1 });
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        gsap.set([...words, skater], { autoAlpha: 1 });
        return;
      }

      // ── The skater ──────────────────────────────────────────────────
      // He is sketched at the left edge of the page once the words are
      // standing, then skates over to his spot under the name — and never
      // quite stops moving after that.
      const fromLeft = () => {
        const heroBox = hero.getBoundingClientRect();
        const stackBox = stack.getBoundingClientRect();
        return -(stackBox.left - heroBox.left) + 12;
      };

      gsap.set(skaterLines, { drawSVG: "0%" });
      gsap.set(skater, { x: fromLeft });

      gsap
        .timeline({ delay: SETTLED + 0.1 })
        .set(skater, { autoAlpha: 1 })
        // Drawn where he stands, one line at a time.
        .to(skaterLines, {
          drawSVG: "100%",
          duration: 0.3,
          stagger: 0.07,
          ease: "none",
        })
        // Then he pushes off and rolls across to the start of the name.
        .to(
          skater,
          { x: 0, duration: 2.1, ease: "power2.inOut" },
          ">-0.1",
        )
        .add(() => {
          // Rolling: a bob, a rock on the board, and the speed lines
          // breathing — he reads as moving even once he has arrived.
          gsap.to(skater, {
            y: -4,
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          gsap.to(skater, {
            rotation: 2.5,
            transformOrigin: "60% 85%",
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          gsap.to(skater, {
            x: "+=22",
            duration: 2.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          gsap.to(q(".skater .doodle-speed"), {
            opacity: 0.15,
            duration: 0.55,
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.12, repeat: -1, yoyo: true },
            ease: "sine.inOut",
          });
        });

      gsap.from(micro, {
        autoAlpha: 0,
        y: 12,
        duration: 0.9,
        stagger: 0.07,
        ease: "power2.out",
        delay: SETTLED - 0.3,
      });

      let particles: Particle[] = [];
      let dpr = 1;
      let w = 0;
      let h = 0;
      let burstX = 0;
      let burstY = 0;
      let starFrom = { x: 0, y: 0 };
      let dotSize = 1.4;
      let ink = "#2c2c2c";
      let accent = "#853953";

      // ── Sample the lockup ───────────────────────────────────────────
      // The particles are read off the very same outlines the SVG draws,
      // transformed into the box the SVG occupies on the page. That is what
      // lets the canvas hand over to the real type at the end without
      // anything shifting by a pixel.
      const stamp = (
        target: CanvasRenderingContext2D,
        lockup: Lockup,
        svg: SVGSVGElement,
        heroBox: DOMRect,
      ) => {
        const box = svg.getBoundingClientRect();
        if (!box.width) return;
        const [vx, vy, vw] = lockup.viewBox.split(" ").map(Number);
        const scale = box.width / vw;
        target.setTransform(
          scale * dpr,
          0,
          0,
          scale * dpr,
          (box.left - heroBox.left - vx * scale) * dpr,
          (box.top - heroBox.top - vy * scale) * dpr,
        );
        for (const glyph of lockup.glyphs) target.fill(new Path2D(glyph.d));
      };

      const build = () => {
        const style = getComputedStyle(hero);
        ink = style.color;
        accent = style.getPropertyValue("--wine").trim() || accent;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        const heroBox = hero.getBoundingClientRect();
        w = hero.clientWidth;
        h = hero.clientHeight;

        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const off = document.createElement("canvas");
        off.width = canvas.width;
        off.height = canvas.height;
        const octx = off.getContext("2d", { willReadFrequently: true });
        if (!octx) return false;
        octx.fillStyle = "#000";
        stamp(octx, SIGNATURE, words[0], heroBox);
        stamp(octx, WORDMARK, words[1], heroBox);

        const data = octx.getImageData(0, 0, off.width, off.height).data;

        let filled = 0;
        let minX = off.width;
        let maxX = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 128) continue;
          filled++;
          const x = ((i - 3) / 4) % off.width;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
        if (!filled) return false;

        // Sampling is by chance rather than on a grid: these faces are a
        // hairline one or two pixels wide in places, and a grid walks
        // straight past those strokes. The dot grows as the sampling thins,
        // so the word holds together either way.
        const keep = Math.min(1, PARTICLE_BUDGET / filled);
        dotSize = Math.max(1.1, 1.05 / Math.sqrt(keep) / dpr);

        burstX = (minX + (maxX - minX) * 0.42) / dpr;
        burstY = h / 2;
        starFrom = { x: w * 1.15, y: -h * 0.25 };

        const span = Math.max(1, (maxX - minX) / dpr);
        const scatter = Math.min(w, h) * 0.13;
        const next: Particle[] = [];

        for (let y = 0; y < off.height; y++) {
          const row = y * off.width;
          for (let x = 0; x < off.width; x++) {
            if (data[(row + x) * 4 + 3] < 128) continue;
            if (Math.random() > keep) continue;
            const hx = x / dpr;
            const hy = y / dpr;
            const angle = Math.random() * Math.PI * 2;
            const radius = scatter * (0.2 + Math.random() * 0.8);
            next.push({
              hx,
              hy,
              sx: burstX + Math.cos(angle) * radius,
              sy: burstY + Math.sin(angle) * radius * 0.65,
              x: burstX,
              y: burstY,
              // The word forms left to right, so it reads as being written
              // rather than snapping into place all at once.
              delay:
                ((hx - minX / dpr) / span) * SPREAD * 0.8 +
                Math.random() * SPREAD * 0.2,
              dur: FLIGHT * (0.8 + Math.random() * 0.28),
            });
          }
        }

        particles = next;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return true;
      };

      // ── Frame ───────────────────────────────────────────────────────
      let t0 = 0;
      let started = false;

      const draw = () => {
        if (!particles.length) return;
        const now = performance.now() / 1000;
        if (!started) {
          t0 = now;
          started = true;
        }
        const t = now - t0;

        ctx.clearRect(0, 0, w, h);

        // The star, before it breaks.
        if (t < STAR) {
          const p = easeInOut(Math.min(1, t / STAR));
          const x = starFrom.x + (burstX - starFrom.x) * p;
          const y = starFrom.y + (burstY - starFrom.y) * p;
          const tail = 320 * (1 - p * 0.5);
          const dx = starFrom.x - burstX;
          const dy = starFrom.y - burstY;
          const len = Math.hypot(dx, dy) || 1;

          const grad = ctx.createLinearGradient(
            x,
            y,
            x + (dx / len) * tail,
            y + (dy / len) * tail,
          );
          grad.addColorStop(0, ink);
          grad.addColorStop(0.4, accent);
          grad.addColorStop(1, "transparent");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + (dx / len) * tail, y + (dy / len) * tail);
          ctx.stroke();

          ctx.fillStyle = ink;
          ctx.beginPath();
          ctx.arc(x, y, 3.6, 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        // The flash left where it broke.
        const since = t - STAR;
        if (since < 0.45) {
          const p = since / 0.45;
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - p) * 0.55;
          ctx.lineWidth = 2 * (1 - p);
          ctx.beginPath();
          ctx.arc(burstX, burstY, 16 + p * 260, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = ink;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const local = since - p.delay;

          if (local <= 0) {
            // Thrown out of the burst over the last moment before it flies,
            // and unlit until then — otherwise every particle still to come
            // sits in a heap where the star broke.
            const k = Math.max(0, 1 + local / Math.max(p.delay, 0.0001));
            p.x = burstX + (p.sx - burstX) * k;
            p.y = burstY + (p.sy - burstY) * k;
            if (local < -0.06) continue;
          } else if (local < p.dur) {
            const e = easeOut(local / p.dur);
            p.x = p.sx + (p.hx - p.sx) * e;
            p.y = p.sy + (p.hy - p.sy) * e;
          } else {
            p.x = p.hx;
            p.y = p.hy;
          }

          ctx.fillRect(p.x, p.y, dotSize, dotSize);
        }
      };

      // ── Wiring ──────────────────────────────────────────────────────
      let ready = false;

      const start = () => {
        if (!build()) {
          gsap.set(words, { autoAlpha: 1 });
          return;
        }
        ready = true;
        gsap.ticker.add(draw);

        // Once every particle is home, the canvas hands over to the type
        // itself: same outlines, same place, so the swap is invisible — and
        // what is left on screen is the lockup, not a cloud of dots.
        gsap
          .timeline({ delay: SETTLED - 0.25 })
          .to(words, { autoAlpha: 1, duration: 0.45, ease: "power2.out" })
          .to(canvas, { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, "<")
          .add(() => {
            gsap.ticker.remove(draw);
            particles = [];
          });
      };

      // The lockup is laid out by the SVG, so wait for it to have a box.
      document.fonts.ready.then(start);

      // A resize mid-flight only has to keep the particles honest; once the
      // type has taken over there is nothing left to redraw.
      const ro = new ResizeObserver(() => {
        if (ready && particles.length) build();
      });
      ro.observe(document.documentElement);

      return () => {
        gsap.ticker.remove(draw);
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
      data-ground="paper"
    >
      <canvas className="lockup-canvas" aria-hidden="true" />

      <div className="stack">
        <h1 className="lockup">
          {/* The lockup is drawn, not set: the two words are glyph outlines,
              which is what lets the particles land exactly on them. An h1 of
              a signature tells a crawler nothing, so the name and role are
              carried here and hidden visually. */}
          <span className="sr-only">
            Aniket Naik — UI/UX designer and full-stack web developer
          </span>

          <svg
            className="lockup-draw is-signature"
            viewBox={SIGNATURE.viewBox}
            aria-hidden="true"
            focusable="false"
            data-anim
          >
            {SIGNATURE.glyphs.map((glyph, i) => (
              <path key={i} d={glyph.d} />
            ))}
          </svg>

          {/* Sketched after the words, as if in the margin. */}
          <Doodle kind="skate" className="skater" title="Skating" />

          <span className="lockup-sub">
            <svg
              className="lockup-draw is-wordmark"
              viewBox={WORDMARK.viewBox}
              aria-hidden="true"
              focusable="false"
              data-anim
            >
              {WORDMARK.glyphs.map((glyph, i) => (
                <path key={i} d={glyph.d} />
              ))}
            </svg>
          </span>
        </h1>
      </div>

      <a className="scroll-cue" href="#about" data-micro data-anim>
        <span>About me</span>
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
    </section>
  );
}
