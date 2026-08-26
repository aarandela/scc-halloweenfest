import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE ?? "https://spacecityhalloweenfest.com",
  output: "static",
  build: {
    format: "directory"
  }
});
