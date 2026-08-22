import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE,
  output: "static",
  build: {
    format: "directory"
  }
});
