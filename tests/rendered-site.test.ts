import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";

let home = "";
let partners = "";
let vendorDirectory = "";

beforeAll(() => {
  execFileSync("npm", ["run", "build"], { stdio: "pipe" });
  home = readFileSync("dist/index.html", "utf8");
  partners = readFileSync("dist/partners/index.html", "utf8");
  vendorDirectory = readFileSync("dist/vendors/index.html", "utf8");
}, 60_000);

describe("public event page", () => {
  it("renders a semantic, descriptive document", () => {
    expect(home).toContain("<main");
    expect(home.match(/<h1\b/g)).toHaveLength(1);
    expect(home).toContain("Space City Halloween Festival");
    expect(home).toContain('name="description"');
    expect(home).toContain('type="application/ld+json"');
  });

  it("uses the supplied Space City Collective artwork in the header", () => {
    expect(home).toContain('src="/space-city-collective-logo.jpg"');
    expect(home).toContain('alt="Space City Collective"');
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

  it("uses an authored poster layout instead of a generic card grid", () => {
    expect(home).toContain('class="hero poster-hero"');
    expect(home).toContain('class="program-list"');
    expect(home).not.toContain("activity-card");
  });

  it("previews the sample vendor lineup and links to the full directory", () => {
    expect(home).toContain("Vendor lineup");
    expect(home).toContain('href="/vendors/"');
    expect(home).toContain("Sample lineup for demonstration");
  });

  it("offers downloadable and Google calendar actions beside the event date", () => {
    expect(home).toContain('href="/space-city-halloween-festival-2026.ics"');
    expect(home).toContain('href="https://calendar.google.com/calendar/render?');
    expect(home).toContain("Add to calendar");
    expect(home).toContain("Google Calendar");
  });

  it("links the sponsor impact pitch directly to business opportunities", () => {
    expect(home).toMatch(/class="impact-band"[\s\S]*href="\/partners\/"[\s\S]*Explore sponsorships/);
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

  it("reads like a practical sponsorship packet", () => {
    expect(partners).toContain("Sponsor the festival.");
    expect(partners).toContain('class="sponsor-ledger"');
    expect(partners).not.toContain("vendor-visual");
  });
});

describe("vendor directory", () => {
  it("clearly identifies the roster as demonstration content", () => {
    expect(vendorDirectory).toContain("Who’ll be there");
    expect(vendorDirectory).toContain("Sample lineup for demonstration");
    expect(vendorDirectory.match(/Sample listing/g)).toHaveLength(6);
  });

  it("renders category filters and filterable vendor entries", () => {
    expect(vendorDirectory).toContain("data-vendor-filter");
    expect(vendorDirectory.match(/data-vendor-card data-category=/g)).toHaveLength(6);
    expect(vendorDirectory).toContain("Sneakers &amp; streetwear");
    expect(vendorDirectory).toContain("Food &amp; drink");
  });

  it("invites unlisted businesses to the vendor inquiry form", () => {
    expect(vendorDirectory).toContain('/partners/?interest=vendor#inquiry');
  });
});

describe("shared site credit", () => {
  it("uses the supplied Space City Collective logo in the header and footer", () => {
    for (const page of [home, partners, vendorDirectory]) {
      expect(page.match(/src="\/space-city-collective-logo\.jpg"/g)).toHaveLength(2);
      expect(page).toContain('class="brand brand-artwork footer-brand"');
    }
  });

  it("credits and links to Arandela & Co. on every page", () => {
    for (const page of [home, partners, vendorDirectory]) {
      expect(page).toContain("Built by <strong>Arandela &amp; Co.</strong>");
      expect(page).toContain('href="https://arandela.co"');
    }
  });
});

describe("social sharing metadata", () => {
  it("uses a large image preview on every page", () => {
    for (const page of [home, partners, vendorDirectory]) {
      expect(page).toContain('property="og:image"');
      expect(page).toContain('/og-image.png');
      expect(page).toContain('name="twitter:card" content="summary_large_image"');
    }
  });
});
