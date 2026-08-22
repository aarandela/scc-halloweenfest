export type InquiryType = "sponsor" | "vendor";

export interface InquiryInput {
  inquiryType: InquiryType | "";
  contactName: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  sponsorTier: string;
  vendorCategory: string;
  message: string;
  consent: boolean;
  company: string;
}

export type InquiryErrors = Partial<Record<keyof InquiryInput | "form", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiry(input: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {};

  if (input.company.trim()) {
    errors.form = "Unable to accept this submission.";
    return errors;
  }

  if (input.inquiryType !== "sponsor" && input.inquiryType !== "vendor") {
    errors.inquiryType = "Choose sponsorship or vending.";
  }
  if (!input.contactName.trim()) errors.contactName = "Enter your name.";
  if (!input.businessName.trim()) errors.businessName = "Enter your business name.";
  if (!input.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!emailPattern.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (input.inquiryType === "sponsor" && !input.sponsorTier) {
    errors.sponsorTier = "Choose a sponsorship level or select ‘Not sure yet’.";
  }
  if (input.inquiryType === "vendor" && !input.vendorCategory.trim()) {
    errors.vendorCategory = "Tell us what your business offers.";
  }
  if (!input.consent) errors.consent = "Confirm that the festival team may contact you.";

  return errors;
}

export function prepareInquiry(input: InquiryInput) {
  return {
    schemaVersion: 1 as const,
    inquiryType: input.inquiryType,
    contactName: input.contactName.trim(),
    businessName: input.businessName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    website: input.website.trim(),
    sponsorTier: input.inquiryType === "sponsor" ? input.sponsorTier : "",
    vendorCategory: input.inquiryType === "vendor" ? input.vendorCategory.trim() : "",
    message: input.message.trim(),
    consent: input.consent
  };
}
