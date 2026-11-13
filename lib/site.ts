/**
 * The canonical origin, used for every absolute URL the site emits:
 * sitemap entries, the robots Sitemap line, and metadataBase.
 *
 * NEXT_PUBLIC_SITE_URL overrides it, so attaching a custom domain later is an
 * environment change rather than a code change. Any trailing slash is stripped
 * — the sitemap builds paths by concatenation and `//about` is a different URL
 * to a crawler.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aniketnaik.vercel.app"
).replace(/\/+$/, "");

/** Absolute URL for a site-root-relative path. */
export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
