import {
  CAMPAIGN_STORAGE_KEY,
  campaignFormFields,
  campaignFromLocation,
  resolveCampaign,
  type CampaignAttribution
} from "../lib/analytics";

type EventProperties = Record<string, string | number | boolean>;

declare global {
  interface Window {
    zaraz?: {
      track: (eventName: string, properties?: EventProperties) => Promise<unknown> | void;
    };
    sccAnalytics?: {
      getCampaign: () => CampaignAttribution | null;
      track: (eventName: string, properties?: EventProperties) => Promise<void>;
    };
  }
}

function readStoredCampaign(): CampaignAttribution | null {
  try {
    const stored = window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY);
    return stored ? JSON.parse(stored) as CampaignAttribution : null;
  } catch {
    return null;
  }
}

function storeCampaign(campaign: CampaignAttribution | null) {
  if (!campaign) return;

  try {
    window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaign));
  } catch {
    // Attribution is useful but should never prevent the site from working.
  }
}

function fillCampaignFields(campaign: CampaignAttribution | null) {
  const fields = campaignFormFields(campaign);

  for (const [name, value] of Object.entries(fields)) {
    document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`).forEach((input) => {
      input.value = value;
    });
  }
}

function trackingProperties(element: HTMLElement): EventProperties {
  const properties: EventProperties = {};

  for (const [key, value] of Object.entries(element.dataset)) {
    if (key === "trackEvent" || !key.startsWith("track") || !value) continue;
    const propertyName = key
      .slice("track".length)
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^_/, "");
    properties[propertyName] = value;
  }

  return properties;
}

const incomingCampaign = campaignFromLocation(window.location.search, window.location.pathname);
const campaign = resolveCampaign(readStoredCampaign(), incomingCampaign);
storeCampaign(campaign);
fillCampaignFields(campaign);

window.sccAnalytics = {
  getCampaign: () => campaign,
  async track(eventName, properties = {}) {
    const campaignProperties = campaignFormFields(campaign);
    const populatedCampaignProperties = Object.fromEntries(
      Object.entries(campaignProperties).filter(([, value]) => value)
    );

    try {
      await window.zaraz?.track(eventName, {
        ...populatedCampaignProperties,
        ...properties
      });
    } catch {
      // Analytics failures must not interrupt navigation or form submission.
    }
  }
};

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const trackedElement = target.closest<HTMLElement>("[data-track-event]");
  const eventName = trackedElement?.dataset.trackEvent;
  if (!trackedElement || !eventName) return;

  void window.sccAnalytics?.track(eventName, trackingProperties(trackedElement));
});

