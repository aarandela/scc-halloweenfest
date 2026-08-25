import { describe, expect, it } from "vitest";
import { activities, event, sponsorBenefits, sponsorTiers } from "../src/data/event";

describe("event content", () => {
  it("preserves the core public event facts from the flyers", () => {
    expect(event.dateISO).toBe("2026-10-24");
    expect(event.dateDisplay).toBe("Saturday, October 24, 2026");
    expect(event.timeDisplay).toBe("2:00–8:00 PM");
    expect(event.admission).toBe("Free to the public");
    expect(event.venue).toBe("Pearland Town Center — Methodist Pavilion");
    expect(event.address).toBe("11200 Broadway St, Pearland, TX 77584");
    expect(event.previousAttendance).toBe(4000);
  });

  it("includes the advertised activities and costume contest time", () => {
    expect(activities.map((activity) => activity.title)).toEqual(
      expect.arrayContaining([
        "Trick-or-treat",
        "Costume contest",
        "Local vendors & makers",
        "Music, games & food"
      ])
    );
    expect(activities.find((activity) => activity.title === "Costume contest")?.time).toBe(
      "5:00–6:00 PM"
    );
  });

  it("uses the official Space City Collective Instagram profile", () => {
    expect(event.socialHandle).toBe("@space_citycollective");
    expect(event.instagramUrl).toBe("https://www.instagram.com/space_citycollective/");
  });
});

describe("sponsorship content", () => {
  it("offers the three published sponsorship prices", () => {
    expect(sponsorTiers.map(({ name, price }) => ({ name, price }))).toEqual([
      { name: "Community Supporter", price: 500 },
      { name: "Event Partner", price: 1000 },
      { name: "Major Sponsor", price: 1500 }
    ]);
  });

  it("reserves premium promotional benefits for the major sponsor", () => {
    const commercial = sponsorBenefits.find((benefit) => benefit.id === "social-commercial");
    const stage = sponsorBenefits.find((benefit) => benefit.id === "stage-recognition");
    const candyBags = sponsorBenefits.find((benefit) => benefit.id === "candy-bag-logo");

    expect(commercial?.tiers).toEqual([false, false, "Custom 30–60 sec commercial"]);
    expect(stage?.tiers).toEqual([false, false, "Included"]);
    expect(candyBags?.tiers).toEqual([false, false, "Included"]);
  });
});
