import { describe, expect, it } from "vitest";
import {
  campaignFormFields,
  campaignFromLocation,
  resolveCampaign,
  type CampaignAttribution
} from "../src/lib/analytics";

const instagramCampaign: CampaignAttribution = {
  source: "instagram",
  medium: "social",
  campaign: "halloween-2026",
  content: "costume-contest-post",
  landingPath: "/"
};

describe("campaign attribution", () => {
  it("reads and normalizes UTM tags from a landing URL", () => {
    expect(
      campaignFromLocation(
        "?utm_source=Instagram&utm_medium=Organic%20Social&utm_campaign=Halloween%202026&utm_content=Costume%20Contest%20Post",
        "/"
      )
    ).toEqual({ ...instagramCampaign, medium: "organic-social" });
  });

  it("does not invent attribution for an untagged visit", () => {
    expect(campaignFromLocation("?interest=vendor", "/partners/")).toBeNull();
  });

  it("keeps an existing campaign when an internal page has no UTM tags", () => {
    expect(resolveCampaign(instagramCampaign, null)).toEqual(instagramCampaign);
  });

  it("uses the latest tagged visit when a new campaign arrives", () => {
    const facebookCampaign = campaignFromLocation(
      "?utm_source=facebook&utm_medium=social&utm_campaign=halloween-2026&utm_content=vendor-call",
      "/partners/"
    );

    expect(resolveCampaign(instagramCampaign, facebookCampaign)).toEqual(facebookCampaign);
  });

  it("maps attribution to non-personal form fields", () => {
    expect(campaignFormFields(instagramCampaign)).toEqual({
      campaign_source: "instagram",
      campaign_medium: "social",
      campaign_name: "halloween-2026",
      campaign_content: "costume-contest-post",
      campaign_landing_page: "/"
    });
  });
});
