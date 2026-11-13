import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card every shared link renders. It runs the site's amber ground and
 * micro-type register rather than a screenshot, so it stays correct as the
 * pages change.
 *
 * No custom font is loaded on purpose: next/font keeps Bodoni and Anton as
 * hashed build assets that this route cannot resolve by path, and fetching a
 * font at build time would make the build depend on the network. The card is
 * set in the default sans instead, tracked wide so it reads as deliberate.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f0a208",
          color: "#18160f",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.72,
          }}
        >
          <span>Folio edition</span>
          <span>{SITE.locality}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 148,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              fontSize: 34,
              letterSpacing: "0.04em",
              maxWidth: 820,
              opacity: 0.8,
            }}
          >
            {SITE.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.72,
          }}
        >
          Interfaces · Motion · Code
        </div>
      </div>
    ),
    size,
  );
}
