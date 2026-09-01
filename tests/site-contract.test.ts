import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("site structure", () => {
  it("provides the public event page", () => {
    expect(existsSync("src/pages/index.astro")).toBe(true);
  });

  it("provides a directly shareable partner page", () => {
    expect(existsSync("src/pages/partners.astro")).toBe(true);
  });

  it("provides a public privacy policy", () => {
    expect(existsSync("src/pages/privacy.astro")).toBe(true);

    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    expect(sitemap).toContain("https://spacecityhalloweenfest.com/privacy/");
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

  it("ships only approved event photography in audience-specific groups", () => {
    for (const name of ["schf1.jpeg", "schf2.jpeg", "schf3.jpeg", "schf5.jpeg", "schf6.jpeg"]) {
      expect(existsSync(`src/assets/event-photos/${name}`)).toBe(true);
    }
    expect(existsSync("src/assets/event-photos/schf4.jpeg")).toBe(false);

    const photoData = readFileSync("src/data/eventPhotos.ts", "utf8");
    expect(photoData).toContain("export const communityPhotos");
    expect(photoData).toContain("export const vendorPhotos");
  });

  it("ships the confirmed Arandela & Co. sponsor artwork", () => {
    expect(existsSync("src/assets/sponsors/arandela-co.png")).toBe(true);

    const sponsorData = readFileSync("src/data/sponsors.ts", "utf8");
    expect(sponsorData).toContain('import arandelaCoLogo from "../assets/sponsors/arandela-co.png"');
    expect(sponsorData).toContain("logo: arandelaCoLogo");
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

  it("publishes a standards-compliant security contact", () => {
    const securityPath = "public/.well-known/security.txt";

    expect(existsSync(securityPath)).toBe(true);
    if (!existsSync(securityPath)) return;

    const security = readFileSync(securityPath, "utf8");
    expect(security).toContain("Contact: mailto:audy@arandela.co");
    expect(security).toContain(
      "Canonical: https://spacecityhalloweenfest.com/.well-known/security.txt"
    );
    expect(security).toMatch(/^Expires: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/m);

    const headers = readFileSync("public/_headers", "utf8");
    expect(headers).toContain("/.well-known/security.txt");
    expect(headers).toContain("Content-Type: text/plain; charset=utf-8");
  });

  it("ships branded short links for campaign sharing", () => {
    const redirects = existsSync("public/_redirects")
      ? readFileSync("public/_redirects", "utf8")
      : "";

    for (const path of ["/ig", "/fb", "/tiktok", "/youtube", "/reddit", "/email", "/sponsor", "/vendor", "/qr"]) {
      expect(redirects).toContain(`${path} https://spacecityhalloweenfest.com/`);
    }
    expect(redirects).toContain(
      "/reddit https://spacecityhalloweenfest.com/?utm_source=reddit&utm_medium=social&utm_campaign=halloween-2026&utm_content=short-link 302"
    );
    expect(redirects).toContain(
      "/email https://spacecityhalloweenfest.com/?utm_source=email&utm_medium=email&utm_campaign=halloween-2026&utm_content=short-link 302"
    );
    // GA4's default channel grouping keys off utm_medium: "email" maps to the
    // Email channel, "outreach" matches nothing and falls into Unassigned.
    expect(redirects).not.toContain("utm_medium=outreach");
    expect(redirects).not.toContain("utm_source=direct");
    expect(redirects).toContain(
      "/qr https://spacecityhalloweenfest.com/?utm_source=print&utm_medium=qr&utm_campaign=halloween-2026&utm_content=event-flyer 302"
    );
    expect(redirects.match(/ 302$/gm)).toHaveLength(18);
  });

  it("ships print-ready QR artwork for the tracked print link", () => {
    const svgPath = "public/space-city-halloween-festival-qr.svg";
    const pngPath = "public/space-city-halloween-festival-qr.png";

    expect(existsSync(svgPath)).toBe(true);
    expect(existsSync(pngPath)).toBe(true);
    if (existsSync(svgPath)) {
      expect(readFileSync(svgPath, "utf8")).toContain("<svg");
    }
    if (existsSync(pngPath)) {
      expect(readFileSync(pngPath).subarray(0, 8)).toEqual(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
      );
    }
  });
});
