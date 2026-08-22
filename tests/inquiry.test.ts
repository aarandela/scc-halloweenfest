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

  it("requires a business category for vendor inquiries", () => {
    const vendorInquiry: InquiryInput = {
      ...sponsorInquiry,
      inquiryType: "vendor",
      sponsorTier: "",
      vendorCategory: ""
    };

    expect(validateInquiry(vendorInquiry).vendorCategory).toBeDefined();
    expect(validateInquiry({ ...vendorInquiry, vendorCategory: "Vintage apparel" })).toEqual({});
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
});
