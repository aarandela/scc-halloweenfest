import { existsSync, readFileSync, statSync } from "node:fs";
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

  it("provides reusable campaign attribution behavior", () => {
    expect(existsSync("src/lib/analytics.ts")).toBe(true);
  });

  it("provides a public vendor directory", () => {
    expect(existsSync("src/pages/vendors.astro")).toBe(true);
  });

  it("keeps vendor listings in reusable data", () => {
    expect(existsSync("src/data/vendors.ts")).toBe(true);
  });

  it("keeps production visibility and future event photos data-driven", () => {
    expect(existsSync("src/config/features.ts")).toBe(true);
    expect(existsSync("src/data/eventPhotos.ts")).toBe(true);
  });

  it("self-hosts the display and body fonts used by the design", () => {
    const css = readFileSync("src/styles/global.css", "utf8");

    expect(existsSync("public/fonts/barlow-condensed-latin-italic.woff2")).toBe(true);
    expect(existsSync("public/fonts/inter-latin.woff2")).toBe(true);
    expect(css).toContain('font-family: "Barlow Condensed"');
    expect(css).toContain('--headline: "Barlow Condensed"');
    expect(css).toContain('font-family: "Inter"');
    expect(css.match(/font-display: swap/g)).toHaveLength(2);
  });

  it("ships an optimized social sharing image", () => {
    expect(existsSync("public/og-image.jpg")).toBe(true);
    expect(statSync("public/og-image.jpg").size).toBeLessThan(150_000);
  });

  it("ships a universally parsed UTC calendar event", () => {
    const calendar = readFileSync("public/space-city-halloween-festival-2026.ics", "utf8");

    expect(calendar).toContain("DTSTART:20261024T190000Z");
    expect(calendar).toContain("DTEND:20261025T010000Z");
    expect(calendar).not.toContain("TZID=");

    // RFC 5545 §3.1: CRLF line endings, and content lines folded at 75 octets.
    // Outlook is the strictest consumer of both.
    const lines = calendar.split("\r\n");
    expect(lines.length).toBeGreaterThan(1);
    expect(calendar).not.toMatch(/(?<!\r)\n/);
    for (const line of lines) {
      expect(Buffer.byteLength(line, "utf8")).toBeLessThanOrEqual(75);
    }
    expect(calendar).toContain("@spacecityhalloweenfest.com");
  });

  it("ships crawler directives, a sitemap, and a real not-found page", () => {
    expect(existsSync("public/robots.txt")).toBe(true);
    expect(existsSync("public/sitemap.xml")).toBe(true);
    expect(existsSync("src/pages/404.astro")).toBe(true);
  });

  it("ships branded short links for campaign sharing", () => {
    const redirects = existsSync("public/_redirects")
      ? readFileSync("public/_redirects", "utf8")
      : "";

    for (const path of ["/ig", "/fb", "/tiktok", "/youtube", "/sponsor", "/vendor"]) {
      expect(redirects).toContain(`${path} https://spacecityhalloweenfest.com/`);
    }
    expect(redirects.match(/ 302$/gm)).toHaveLength(12);
  });
});
