import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// A portfolio has nothing to hide from crawlers; the only disallowed path is
// Next's internal asset route, which has no indexable content.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/_next/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
