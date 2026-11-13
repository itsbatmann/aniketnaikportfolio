import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";
import { absoluteUrl } from "@/lib/site";

// Every page on the site is statically generated, so one build time stands in
// for `lastModified` across the board. There is no /work index route — the
// work list is a section of the home page — so only the case pages are
// enumerated below.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    ...PROJECTS.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
