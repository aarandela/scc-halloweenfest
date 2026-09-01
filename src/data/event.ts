export const event = {
  organizer: "Space City Collective",
  name: "Space City Halloween Festival",
  description:
    "A free community Halloween festival with trick-or-treating, costumes, music, games, local vendors, activities, and food.",
  dateISO: "2026-10-24",
  dateDisplay: "Saturday, October 24, 2026",
  timeDisplay: "2:00–8:00 PM",
  admission: "Free to the public",
  venue: "Pearland Town Center — Methodist Pavilion",
  address: "11200 Broadway St, Pearland, TX 77584",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=11200%20Broadway%20St%2C%20Pearland%2C%20TX%2077584",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Pearland%20Town%20Center%20Methodist%20Pavilion%2C%2011200%20Broadway%20St%2C%20Pearland%2C%20TX%2077584&output=embed",
  calendarDownloadUrl: "/space-city-halloween-festival-2026.ics",
  googleCalendarUrl:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Space%20City%20Halloween%20Festival&dates=20261024T190000Z%2F20261025T010000Z&details=Free%20community%20Halloween%20festival%20with%20trick-or-treating%2C%20costumes%2C%20vendors%2C%20music%2C%20games%2C%20and%20food.&location=Pearland%20Town%20Center%20%E2%80%94%20Methodist%20Pavilion%2C%2011200%20Broadway%20St%2C%20Pearland%2C%20TX%2077584",
  previousAttendance: 4000,
  contactEmail: "spacecitycollective713@gmail.com",
  privacyEmail: "audy@arandela.co",
  socialHandle: "@space_citycollective",
  instagramUrl: "https://www.instagram.com/space_citycollective/"
} as const;

export const activities = [
  {
    title: "Trick-or-treat",
    description: "Participating Pearland Town Center stores will be handing out candy.",
    time: "Throughout the festival",
    icon: "candy"
  },
  {
    title: "Costume contest",
    description: "Come dressed to impress and join the community costume contest.",
    time: "5:00–6:00 PM",
    icon: "trophy"
  },
  {
    title: "Local vendors & makers",
    description: "Shop goods from local businesses, makers, and community vendors.",
    time: "2:00–8:00 PM",
    icon: "spark"
  },
  {
    title: "Music, games & food",
    description: "Stay for music, family-friendly games, community, and plenty to eat.",
    time: "2:00–8:00 PM",
    icon: "music"
  }
] as const;

export type TierBenefit = false | "Included" | string;

export interface SponsorBenefit {
  id: string;
  label: string;
  tiers: readonly [TierBenefit, TierBenefit, TierBenefit];
}

export const sponsorTiers = [
  {
    id: "community-supporter",
    name: "Community Supporter",
    price: 500,
    description: "A strong foundation of event-wide visibility."
  },
  {
    id: "event-partner",
    name: "Event Partner",
    price: 1000,
    description: "On-site presence and recognition during the costume contest."
  },
  {
    id: "major-sponsor",
    name: "Major Sponsor",
    price: 1500,
    description: "The festival’s highest-visibility package and premium placement."
  }
] as const;

export const sponsorBenefits: readonly SponsorBenefit[] = [
  {
    id: "stage-banner-logo",
    label: "Logo on the main-stage event banner",
    tiers: ["Included", "Included", "Included"]
  },
  {
    id: "social-shoutout",
    label: "Social media shout-out",
    tiers: ["Included", "Included", "Included"]
  },
  {
    id: "print-logo",
    label: "Logo on event flyers and posters",
    tiers: ["Included", "Included", "Included"]
  },
  {
    id: "website-logo",
    label: "Logo on the event website",
    tiers: ["Included", "Included", "Included"]
  },
  {
    id: "pa-mention",
    label: "Mention in PA announcements",
    tiers: ["Included", "Included", "Included"]
  },
  {
    id: "contest-announcement",
    label: "Announcement during the Halloween costume contest",
    tiers: [false, "Included", "Premier mention"]
  },
  {
    id: "business-table",
    label: "10 × 10 business table at the event",
    tiers: [false, "Included", "Premium location"]
  },
  {
    id: "social-commercial",
    label: "Commercial or promotion on social media",
    tiers: [false, false, "Custom 30–60 sec commercial"]
  },
  {
    id: "stage-recognition",
    label: "Stage recognition throughout the event",
    tiers: [false, false, "Included"]
  },
  {
    id: "candy-bag-logo",
    label: "Logo on trick-or-treat candy bags",
    tiers: [false, false, "Included"]
  },
  {
    id: "event-signage",
    label: "Event-day sponsorship signage",
    tiers: ["Standard display", "Larger display", "Premium display"]
  }
];
