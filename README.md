# aniketnaikportfolio

Portfolio of Aniket Naik — UI/UX designer and full-stack web developer.

An editorial, motion-led single page: an amber hero lockup, an approach
statement, a four-project work index with cursor-tracked previews, and a
contact close — plus a case page per project.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19
- Tailwind CSS v4 + hand-written CSS in `app/globals.css`
- [GSAP](https://gsap.com) — ScrollTrigger, SplitText, DrawSVG, ScrollTo
- Bodoni Moda via `next/font`; Acumin Pro via an optional Adobe Fonts kit

## Running it

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the build
npm run lint
```

### Optional environment

`NEXT_PUBLIC_TYPEKIT_ID` — an Adobe Fonts kit id for Acumin Pro, the face used
for the small uppercase type. Without it the stack falls back to
Helvetica/Arial.

## Structure

| Path | What it holds |
| --- | --- |
| `app/page.tsx` | Hero, approach, work index, contact |
| `app/work/[slug]/page.tsx` | A case page per project, statically generated |
| `app/about/page.tsx` | About — placeholder, waiting on copy |
| `lib/projects.ts` | The four projects: copy, scope, stack, motif |
| `components/` | Section components, the fixed nav, project motifs |
| `app/globals.css` | Design tokens and every section's styles |

Project titles, years, copy, links and the contact email in
`components/Contact.tsx` are placeholders — edit `lib/projects.ts` to change
the work index and the case pages together.
