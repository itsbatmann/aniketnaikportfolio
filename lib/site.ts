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

/**
 * One source of truth for the identity the site claims, shared by the metadata
 * in every route and by the JSON-LD in the root layout. Search engines treat a
 * name/role that differs between the two as a weaker signal, so they are not
 * written out twice.
 */
/* ── YOUR DETAILS ──────────────────────────────────────────────────────
 * These three are the only placeholders left on the site. Paste the real
 * ones here and everything picks them up: the links in the footer, the
 * mailto, and the `sameAs` profiles in the structured data that tell Google
 * these accounts are the same person.
 */
const LINKEDIN = "https://www.linkedin.com/in/aniket--naik/";
const GITHUB = "https://github.com/itsbatmann";
const EMAIL = "aniketttnaik@gmail.com";
/* ──────────────────────────────────────────────────────────────────── */

export const SITE = {
  name: "Aniket Naik",
  /** Used for `og:site_name` and the `title.template` suffix. */
  shortName: "Aniket Naik",
  role: "UI/UX designer and full-stack web developer",
  locality: "Mumbai",
  country: "India",
  /**
   * The home page description. Written to read as a sentence a human would
   * click, not a keyword list — but it still carries the two terms someone
   * would actually search ("UI/UX designer", "full-stack web developer")
   * alongside the name, which is the query this site can realistically win.
   */
  description:
    "Aniket Naik is a UI/UX designer and full-stack web developer in Mumbai, India, building interfaces, motion and the code underneath them with Next.js, React and GSAP.",
  email: EMAIL,
  linkedin: LINKEDIN,
  github: GITHUB,
  /**
   * Profiles that corroborate the same person. `sameAs` is how a search engine
   * links this site to an existing entity, so these must be the real accounts.
   */
  socials: [LINKEDIN, GITHUB],
} as const;
