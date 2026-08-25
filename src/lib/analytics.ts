export const CAMPAIGN_STORAGE_KEY = "scc_campaign_attribution";

export interface CampaignAttribution {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  landingPath: string;
}

function normalizeCampaignValue(value: string | null): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 100);
}

function normalizeLandingPath(pathname: string): string {
  const cleanPath = pathname.trim().split(/[?#]/, 1)[0] ?? "/";
  return cleanPath.startsWith("/") ? cleanPath.slice(0, 200) : "/";
}

export function campaignFromLocation(search: string, pathname: string): CampaignAttribution | null {
  const params = new URLSearchParams(search);
  const campaign = {
    source: normalizeCampaignValue(params.get("utm_source")),
    medium: normalizeCampaignValue(params.get("utm_medium")),
    campaign: normalizeCampaignValue(params.get("utm_campaign")),
    content: normalizeCampaignValue(params.get("utm_content")),
    landingPath: normalizeLandingPath(pathname)
  };

  return campaign.source || campaign.medium || campaign.campaign || campaign.content ? campaign : null;
}

export function resolveCampaign(
  current: CampaignAttribution | null,
  incoming: CampaignAttribution | null
): CampaignAttribution | null {
  return incoming ?? current;
}

export function campaignFormFields(campaign: CampaignAttribution | null) {
  return {
    campaign_source: campaign?.source ?? "",
    campaign_medium: campaign?.medium ?? "",
    campaign_name: campaign?.campaign ?? "",
    campaign_content: campaign?.content ?? "",
    campaign_landing_page: campaign?.landingPath ?? ""
  };
}
