import { existsSync } from "node:fs";
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
});
