export const vendorCategories = [
  "All",
  "Sneakers & streetwear",
  "Vintage",
  "Food & drink",
  "Art & goods",
  "Community"
] as const;

export type VendorCategory = Exclude<(typeof vendorCategories)[number], "All">;

export interface VendorListing {
  id: string;
  name: string;
  category: VendorCategory;
  description: string;
  monogram: string;
  featured: boolean;
  isPlaceholder: true;
  statusLabel: "Sample listing";
}

export const vendors: readonly VendorListing[] = [
  {
    id: "vendor-name-01",
    name: "Vendor Name 01",
    category: "Sneakers & streetwear",
    description: "Use this space for a short introduction to the brand and what shoppers can expect.",
    monogram: "01",
    featured: true,
    isPlaceholder: true,
    statusLabel: "Sample listing"
  },
  {
    id: "vintage-shop-02",
    name: "Vintage Shop 02",
    category: "Vintage",
    description: "Highlight signature finds, specialties, or a quick reason to stop by the booth.",
    monogram: "02",
    featured: true,
    isPlaceholder: true,
    statusLabel: "Sample listing"
  },
  {
    id: "food-vendor-03",
    name: "Food Vendor 03",
    category: "Food & drink",
    description: "Feature a popular menu item, cuisine, or festival special in one concise sentence.",
    monogram: "03",
    featured: true,
    isPlaceholder: true,
    statusLabel: "Sample listing"
  },
  {
    id: "local-maker-04",
    name: "Local Maker 04",
    category: "Art & goods",
    description: "Introduce the maker and the original goods visitors will be able to shop in person.",
    monogram: "04",
    featured: true,
    isPlaceholder: true,
    statusLabel: "Sample listing"
  },
  {
    id: "community-booth-05",
    name: "Community Booth 05",
    category: "Community",
    description: "Share the organization’s local mission, activity, or resource for Pearland families.",
    monogram: "05",
    featured: false,
    isPlaceholder: true,
    statusLabel: "Sample listing"
  },
  {
    id: "dessert-vendor-06",
    name: "Dessert Vendor 06",
    category: "Food & drink",
    description: "Call out the sweet treat or seasonal specialty attendees should look for at the event.",
    monogram: "06",
    featured: false,
    isPlaceholder: true,
    statusLabel: "Sample listing"
  }
];
