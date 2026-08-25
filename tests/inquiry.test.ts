import { describe, expect, it } from "vitest";
import { prepareInquiry, validateInquiry, type InquiryInput } from "../src/lib/inquiry";

const sponsorInquiry: InquiryInput = {
  inquiryType: "sponsor",
  contactName: "  Ada Lovelace  ",
  businessName: "  Analytical Engines  ",
  email: "ada@example.com",
  phone: "",
  website: "",
  sponsorTier: "event-partner",
  vendorCategory: "",
  vendorOtherDescription: "",
  message: "  Please send next steps.  ",
  consent: true,
  company: ""
};

describe("inquiry validation", () => {
  it("requires useful contact details and consent", () => {
    const errors = validateInquiry({
      ...sponsorInquiry,
      contactName: "",
      businessName: "",
      email: "",
      consent: false
    });

    expect(errors).toMatchObject({
      contactName: expect.any(String),
      businessName: expect.any(String),
      email: expect.any(String),
      consent: expect.any(String)
    });
  });

  it("rejects malformed email addresses", () => {
    expect(validateInquiry({ ...sponsorInquiry, email: "not-an-email" }).email).toBeDefined();
  });

  it("requires a sponsor tier for sponsor inquiries", () => {
    expect(validateInquiry({ ...sponsorInquiry, sponsorTier: "" }).sponsorTier).toBeDefined();
  });

  it("accepts broad vendor categories and requires details for Other", () => {
    const vendorInquiry: InquiryInput = {
      ...sponsorInquiry,
      inquiryType: "vendor",
      sponsorTier: "",
      vendorCategory: "",
      vendorOtherDescription: ""
    };

    expect(validateInquiry(vendorInquiry).vendorCategory).toBeDefined();
    expect(validateInquiry({ ...vendorInquiry, vendorCategory: "Retail & merchandise" })).toEqual({});
    expect(
      validateInquiry({ ...vendorInquiry, vendorCategory: "Vintage apparel" }).vendorCategory
    ).toBeDefined();
    expect(validateInquiry({ ...vendorInquiry, vendorCategory: "Other" }).vendorOtherDescription).toBeDefined();
    expect(
      validateInquiry({
        ...vendorInquiry,
        vendorCategory: "Other",
        vendorOtherDescription: "Mobile pet adoption booth"
      })
    ).toEqual({});
  });

  it("silently rejects honeypot submissions", () => {
    expect(validateInquiry({ ...sponsorInquiry, company: "Spam Company" }).form).toBeDefined();
  });
});

describe("inquiry payload", () => {
  it("trims user-entered values and attaches a schema version", () => {
    expect(prepareInquiry(sponsorInquiry)).toMatchObject({
      schemaVersion: 1,
      inquiryType: "sponsor",
      contactName: "Ada Lovelace",
      businessName: "Analytical Engines",
      message: "Please send next steps."
    });
  });

  it("includes an Other vendor description only when it applies", () => {
    expect(prepareInquiry({
      ...sponsorInquiry,
      inquiryType: "vendor",
      sponsorTier: "",
      vendorCategory: "Other",
      vendorOtherDescription: "  Kids activity booth  "
    })).toMatchObject({
      vendorCategory: "Other",
      vendorOtherDescription: "Kids activity booth"
    });

    expect(prepareInquiry({
      ...sponsorInquiry,
      inquiryType: "vendor",
      sponsorTier: "",
      vendorCategory: "Food & beverage",
      vendorOtherDescription: "Should not be included"
    }).vendorOtherDescription).toBe("");
  });
});
