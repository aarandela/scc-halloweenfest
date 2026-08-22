import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";

let home = "";
let partners = "";

beforeAll(() => {
  execFileSync("npm", ["run", "build"], { stdio: "pipe" });
  home = readFileSync("dist/index.html", "utf8");
  partners = readFileSync("dist/partners/index.html", "utf8");
}, 60_000);

describe("public event page", () => {
  it("renders a semantic, descriptive document", () => {
    expect(home).toContain("<main");
    expect(home.match(/<h1\b/g)).toHaveLength(1);
    expect(home).toContain("Space City Halloween Festival");
    expect(home).toContain('name="description"');
    expect(home).toContain('type="application/ld+json"');
  });

  it("makes the essential visit details visible", () => {
    expect(home).toContain("Saturday, October 24, 2026");
    expect(home).toContain("2:00–8:00 PM");
    expect(home).toContain("Free to the public");
    expect(home).toContain("11200 Broadway St, Pearland, TX 77584");
  });

  it("provides a direct route for prospective businesses", () => {
    expect(home).toMatch(/href="\/partners\/"[^>]*>[^<]*(Partner|business)/i);
  });
});

describe("partner page", () => {
  it("renders all published sponsorship levels", () => {
    for (const content of [
      "Community Supporter",
      "$500",
      "Event Partner",
      "$1,000",
      "Major Sponsor",
      "$1,500"
    ]) {
      expect(partners).toContain(content);
    }
  });

  it("contains a sponsor and vendor inquiry form with accessible fields", () => {
    expect(partners).toContain("data-inquiry-form");
    expect(partners).toContain('value="sponsor"');
    expect(partners).toContain('value="vendor"');
    expect(partners).toContain('name="contactName"');
    expect(partners).toContain('name="businessName"');
    expect(partners).toContain('name="email"');
    expect(partners).toContain('aria-live="polite"');
  });

  it("is ready for a future form endpoint without claiming delivery is active", () => {
    expect(partners).toContain('action="/api/inquiries"');
    expect(partners).toContain("Online delivery is being connected");
  });
});
