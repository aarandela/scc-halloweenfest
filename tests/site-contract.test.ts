import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("site structure", () => {
  it("provides the public event page", () => {
    expect(existsSync("src/pages/index.astro")).toBe(true);
  });

  it("provides a directly shareable partner page", () => {
    expect(existsSync("src/pages/partners.astro")).toBe(true);
  });

  it("provides centralized event content", () => {
    expect(existsSync("src/data/event.ts")).toBe(true);
  });

  it("provides reusable sponsor inquiry behavior", () => {
    expect(existsSync("src/lib/inquiry.ts")).toBe(true);
  });

  it("provides a public vendor directory", () => {
    expect(existsSync("src/pages/vendors.astro")).toBe(true);
  });

  it("keeps vendor listings in reusable data", () => {
    expect(existsSync("src/data/vendors.ts")).toBe(true);
  });

  it("self-hosts the display and body fonts used by the design", () => {
    const css = readFileSync("src/styles/global.css", "utf8");

    expect(existsSync("public/fonts/anton-latin.woff2")).toBe(true);
    expect(existsSync("public/fonts/inter-latin.woff2")).toBe(true);
    expect(css).toContain('font-family: "Anton"');
    expect(css).toContain('font-family: "Inter"');
    expect(css.match(/font-display: swap/g)).toHaveLength(2);
  });

  it("ships a social sharing image", () => {
    expect(existsSync("public/og-image.png")).toBe(true);
  });

  it("ships a downloadable calendar event", () => {
    expect(existsSync("public/space-city-halloween-festival-2026.ics")).toBe(true);
  });
});
