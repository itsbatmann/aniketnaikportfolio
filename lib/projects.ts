export type Motif = "car" | "web" | "grid" | "cup" | "spider";

export type Project = {
  slug: string;
  /** The editorial index number shown in the work list. */
  no: string;
  title: string;
  /** One line, set under the title in the list. */
  line: string;
  /** Front-end / Full-stack — the honest shape of the build. */
  scope: string;
  stack: string[];
  /** Placeholder years — swap for the real ones. */
  year: string;
  /** Shown as a small tag; "In progress" reads as a live state. */
  status?: string;
  motif: Motif;
  /** Drop a screenshot at /public/work/<slug>.jpg and set this to use it. */
  cover?: string;
  /** Live site / repository — left empty until the real URLs exist. */
  href?: string;
  repo?: string;
  /** Detail-page copy. Written from what the build actually is. */
  overview: string[];
  highlights: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "automotive",
    no: "01",
    title: "Automotive",
    line: "A performance car microsite built as a motion study.",
    scope: "Front-end",
    stack: ["Next.js", "GSAP", "CSS"],
    year: "2025",
    motif: "car",
    href: "https://timelesswheels.vercel.app/",
    overview: [
      "A single-page site for a performance car, built front-end only. The brief was speed made legible: a hero that arrives like a reveal, specifications that read as editorial type rather than a table, and transitions carrying the weight of the machine.",
      "Every value on the page is typographic. No stock photography does the lifting — the pace of the motion does.",
    ],
    highlights: [
      "Scroll-driven reveal sequence",
      "Specification type system",
      "Responsive from 360px up",
    ],
  },
  {
    slug: "spider-man",
    no: "02",
    title: "Spider-Man",
    line: "A fan experience built around SVG line work and motion.",
    scope: "Full-stack",
    stack: ["React", "GSAP", "SVG"],
    year: "2025",
    status: "Coming soon",
    motif: "spider",
    overview: [
      "A front-end only fan site: a comic-book subject handled with restraint. Webs are drawn as live SVG and animated stroke by stroke, so the page reads as line art rather than imagery.",
      "The point of the build was interaction detail — pointer-reactive artwork, staged entrances, and a palette held to two colours.",
    ],
    highlights: [
      "Hand-built SVG web geometry",
      "Stroke-drawn entrances",
      "Pointer-reactive artwork",
    ],
  },
  {
    slug: "crm",
    no: "03",
    title: "CRM Platform",
    line: "A full-stack customer system — interface, API and data.",
    scope: "Full-stack",
    stack: ["Next.js", "API routes", "Database", "Auth"],
    year: "2025",
    motif: "grid",
    href: "https://crm-rho-one-60.vercel.app/",
    overview: [
      "The one project here that runs end to end: an interface for managing customers, pipeline and activity, sitting on its own API and database rather than mock data.",
      "The design work was making a dense product screen calm — a tight type scale, one accent, and tables that stay readable as the data grows.",
    ],
    highlights: [
      "Front-end and back-end in one codebase",
      "Authenticated, role-aware views",
      "Dense data kept legible",
    ],
  },
  {
    slug: "cafe",
    no: "04",
    title: "Café",
    line: "A neighbourhood café site — front-end now, back-end next.",
    scope: "Front-end",
    stack: ["React", "GSAP"],
    year: "2026",
    status: "In progress",
    motif: "cup",
    href: "https://work1-nine-lime.vercel.app/",
    overview: [
      "A warm, quiet site for a café: menu, hours, story and a booking surface. The front end is built and standing on its own.",
      "The back end is the next phase — menu content and reservations move behind an API, with the current pages wired to it rather than rebuilt.",
    ],
    highlights: [
      "Menu and story pages complete",
      "Booking flow designed, front-end only",
      "Back-end integration in progress",
    ],
  },
];

export const getProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);
