export interface EventPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Add approved event photography here. The gallery stays out of the public
// build while this array is empty, so production never shows placeholders.
export const eventPhotos: readonly EventPhoto[] = [];
