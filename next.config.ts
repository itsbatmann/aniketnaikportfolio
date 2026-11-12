import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
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
