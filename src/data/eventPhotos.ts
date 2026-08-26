import type { ImageMetadata } from "astro";
import schf1 from "../assets/event-photos/schf1.jpeg";
import schf2 from "../assets/event-photos/schf2.jpeg";
import schf3 from "../assets/event-photos/schf3.jpeg";
import schf5 from "../assets/event-photos/schf5.jpeg";
import schf6 from "../assets/event-photos/schf6.jpeg";

export interface EventPhoto {
  src: ImageMetadata;
  alt: string;
}

export const communityPhotos: readonly EventPhoto[] = [
  {
    src: schf3,
    alt: "Families gathering around the Methodist Pavilion during last year's festival"
  },
  {
    src: schf5,
    alt: "Festival visitors meeting community vendors under the pavilion"
  },
  {
    src: schf6,
    alt: "Visitors trick-or-treating at a participating Pearland Town Center store"
  }
];

export const vendorPhotos: readonly EventPhoto[] = [
  {
    src: schf1,
    alt: "Apparel and accessories displayed at a festival vendor booth"
  },
  {
    src: schf2,
    alt: "Sneakers displayed across a festival vendor table"
  }
];
