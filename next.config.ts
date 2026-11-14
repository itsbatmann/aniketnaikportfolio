import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // /about used to be its own route and is already indexed; the about section
  // now lives on the home page, so send that URL to it rather than 404.
  async redirects() {
    return [{ source: "/about", destination: "/#about", permanent: true }];
  },
  // Pin the workspace root so Turbopack does not walk up into the home directory.
  turbopack: {
    root: path.resolve(process.cwd()),
    // Without this rule `@import "tailwindcss"` is left untouched, so neither
    // preflight nor any utility class is emitted.
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
