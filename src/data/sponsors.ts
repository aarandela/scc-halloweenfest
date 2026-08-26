import type { ImageMetadata } from "astro";
import arandelaCoLogo from "../assets/sponsors/arandela-co.png";
import { sponsorTiers } from "./event";

export type SponsorTierId = (typeof sponsorTiers)[number]['id']

export interface Sponsor {
  id: string
  name: string
  tierId: SponsorTierId
  /** Local artwork optimized by Astro. Falls back to the monogram when absent. */
  logo?: ImageMetadata;
  url?: string;
  monogram: string;
}

/**
 * Confirmed sponsors only. Every tier includes "logo on the event website",
 * so each confirmed sponsor belongs here.
 */
export const sponsors: readonly Sponsor[] = [
  {
    id: "arandela-co",
    name: "Arandela & Co.",
    tierId: "community-supporter",
    logo: arandelaCoLogo,
    url: "https://arandela.co",
    monogram: "A&C"
  }
];

export function tierNameFor(tierId: SponsorTierId) {
  return sponsorTiers.find((tier) => tier.id === tierId)?.name ?? "";
}

export function sponsorsByTier() {
  return sponsorTiers
    .map((tier) => ({
      tier,
      members: sponsors.filter((sponsor) => sponsor.tierId === tier.id),
    }))
    .filter((group) => group.members.length > 0)
    .reverse();
}
