import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:8000",
    trace: "retain-on-failure"
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } }
  ],
  webServer: process.env.PLAYWRIGHT_USE_EXISTING_SERVER
      ? undefined
      : {
        command: "ASTRO_PREVIEW_BACKGROUND=0 npm run preview -- --host 127.0.0.1 --port 8000",
        url: "http://127.0.0.1:8000",
        reuseExistingServer: true
      }
});
