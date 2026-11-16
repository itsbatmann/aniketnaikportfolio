import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A traced drawing from /public, inlined at build time rather than loaded as
 * an image, because GSAP's DrawSVGPlugin has to reach the paths in the DOM to
 * draw them. A server component, so the file read never ships to the
 * browser. The files are made by scripts/trace-mandala.mjs.
 */
export default function InlineSvg({
  file,
  className,
}: {
  /** Path under /public, e.g. "interlude/mandala.svg". */
  file: string;
  className?: string;
}) {
  const svg = readFileSync(join(process.cwd(), "public", file), "utf8");
  return (
    <div
      className={className}
      aria-hidden="true"
      // The markup is a static file this repo owns; no user input reaches it.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
