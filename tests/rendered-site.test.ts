import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";

let home = "";
let partners = "";
let inquiryThanks = "";
let vendorDirectory = "";

beforeAll(() => {
  execFileSync("npm", ["run", "build"], {
    stdio: "pipe",
    env: {
      ...process.env,
      PUBLIC_WEB3FORMS_ACCESS_KEY: "00000000-0000-0000-0000-000000000000",
      PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA"
    }
  });
  home = readFileSync("dist/index.html", "utf8");
  partners = readFileSync("dist/partners/index.html", "utf8");
  inquiryThanks = readFileSync("dist/partners/thanks/index.html", "utf8");
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

  it("presents a broad community festival while crediting its organizer", () => {
    expect(home).toContain("Presented by Space City Collective");
    expect(home).toContain("Local vendors &amp; makers");
    expect(home).not.toMatch(/sneakers\s*(?:&amp;|&|,)\s*vintage/i);
    expect(home).not.toContain("streetwear");
    expect(partners).not.toContain("Vintage, streetwear");
  });

  it("provides a direct route for prospective businesses", () => {
    expect(home).toMatch(/href="\/partners\/"[^>]*>[^<]*(Partner|business)/i);
  });

  it("uses an authored poster layout instead of a generic card grid", () => {
    expect(home).toContain('class="hero poster-hero"');
    expect(home).toContain('class="program-list"');
    expect(home).not.toContain("activity-card");
  });

  it("does not publish placeholder vendors before the real lineup is ready", () => {
    expect(home).not.toContain("Vendor lineup");
    expect(home).not.toContain('href="/vendors/"');
    expect(home).not.toContain("Sample lineup for demonstration");
  });

  it("offers downloadable and Google calendar actions beside the event date", () => {
    expect(home).toContain('href="/space-city-halloween-festival-2026.ics"');
    expect(home).toContain('href="https://calendar.google.com/calendar/render?');
    expect(home).toContain("Add to calendar");
    expect(home).toContain("Google Calendar");
    expect(home).toContain('data-track-event="calendar_added"');
  });

  it("links the sponsor impact pitch directly to business opportunities", () => {
    expect(home).toMatch(/class="impact-band"[\s\S]*href="\/partners\/"[\s\S]*Explore sponsorships/);
    expect(home).toMatch(/href="\/partners\/"[^>]*data-track-event="partner_cta_clicked"/);
  });

  it("embeds a real, accessible Google map for the venue", () => {
    expect(home).toContain('class="venue-map"');
    expect(home).toContain('title="Google map showing Pearland Town Center — Methodist Pavilion"');
    expect(home).toContain('loading="lazy"');
    expect(home).toContain("google.com/maps");
    expect(home).not.toContain('class="pin-drawing"');
  });

  it("does not render photo placeholders while awaiting event photography", () => {
    expect(home).not.toContain('data-event-gallery');
    expect(home).not.toContain("Sample event photo");
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
    for (const name of [
      "campaign_source",
      "campaign_medium",
      "campaign_name",
      "campaign_content",
      "campaign_landing_page"
    ]) {
      expect(partners).toContain(`name="${name}"`);
    }
  });

  it("submits inquiries through the established Web3Forms pattern", () => {
    expect(partners).toContain('action="https://api.web3forms.com/submit"');
    expect(partners).toContain('name="access_key"');
    expect(partners).toContain('name="subject"');
    expect(partners).toContain('name="botcheck"');
    expect(partners).toContain('class="cf-turnstile"');
    expect(partners).toContain("challenges.cloudflare.com/turnstile/v0/api.js");
    expect(partners).not.toContain("Online delivery is being connected");
  });

  it("reads like a practical sponsorship packet", () => {
    expect(partners).toContain("Sponsor the festival.");
    expect(partners).toContain('class="sponsor-ledger"');
    expect(partners).not.toContain("vendor-visual");
  });
});

describe("inquiry conversion page", () => {
  it("provides a private, dedicated success URL for conversion counting", () => {
    expect(inquiryThanks).toContain("We received your inquiry.");
    expect(inquiryThanks).toContain('name="robots" content="noindex, nofollow"');
    expect(inquiryThanks).not.toContain("data-inquiry-form");
  });
});

describe("vendor directory", () => {
  it("redirects the unpublished directory without exposing sample listings", () => {
    expect(vendorDirectory).not.toContain("Sample lineup for demonstration");
    expect(vendorDirectory).not.toContain("data-vendor-card");
    expect(vendorDirectory).toMatch(/url=\/?["']/i);
  });
});

describe("shared site credit", () => {
  it("uses the supplied Space City Collective logo in the header and footer", () => {
    for (const page of [home, partners]) {
      expect(page.match(/src="\/space-city-collective-logo\.jpg"/g)).toHaveLength(2);
      expect(page).toContain('class="brand brand-artwork footer-brand"');
    }
  });

  it("credits and links to Arandela & Co. on every page", () => {
    for (const page of [home, partners]) {
      expect(page).toContain("Built by <strong>Arandela &amp; Co.</strong>");
      expect(page).toContain('href="https://arandela.co"');
    }
  });

  it("links the official Instagram profile from shared contact areas", () => {
    for (const page of [home, partners]) {
      expect(page).toContain('href="https://www.instagram.com/space_citycollective/"');
      expect(page).toContain('data-track-event="social_link_clicked"');
      expect(page).toContain("@space_citycollective");
    }
  });
});

describe("social sharing metadata", () => {
  it("uses a large image preview on every page", () => {
    for (const page of [home, partners]) {
      expect(page).toContain('property="og:image"');
      expect(page).toContain('/og-image.png');
      expect(page).toContain('name="twitter:card" content="summary_large_image"');
    }
  });
});
