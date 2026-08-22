import { describe, expect, it } from "vitest";
import { vendorCategories, vendors } from "../src/data/vendors";

describe("placeholder vendor roster", () => {
  it("contains six clearly labeled sample listings", () => {
    expect(vendors).toHaveLength(6);
    expect(vendors.every((vendor) => vendor.isPlaceholder)).toBe(true);
    expect(vendors.every((vendor) => vendor.statusLabel === "Sample listing")).toBe(true);
  });

  it("uses stable unique IDs", () => {
    expect(new Set(vendors.map((vendor) => vendor.id)).size).toBe(vendors.length);
  });

  it("demonstrates a useful range of vendor categories", () => {
    expect(vendorCategories).toEqual([
      "All",
      "Sneakers & streetwear",
      "Vintage",
      "Food & drink",
      "Art & goods",
      "Community"
    ]);
    expect(new Set(vendors.map((vendor) => vendor.category))).toEqual(
      new Set(vendorCategories.slice(1))
    );
  });
});
