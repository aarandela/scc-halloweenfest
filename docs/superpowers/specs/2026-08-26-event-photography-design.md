# Event Photography Placement Design

## Goal

Use approved photography from last year's festival to give new visitors immediate social proof and to show prospective vendors that the event provides a real marketplace. The photography will be embedded in the existing homepage and business page; this work will not add a gallery page, carousel, modal, or new route.

## Approved assets and assignments

- `schf3.jpeg`: primary homepage community photograph.
- `schf5.jpeg`: supporting homepage photograph showing families and pavilion activity.
- `schf6.jpeg`: supporting homepage photograph showing activity at a participating Town Center store.
- `schf1.jpeg`: business-page vendor photograph focused on apparel and merchandise.
- `schf2.jpeg`: business-page vendor photograph focused on the sneaker display.
- `schf4.jpeg`: explicitly excluded and must not ship with the site.

Space City Collective supplied and authorized the approved images. The merchandise images will be cropped below their screenshot arrows and around the products. No attendee will be identified by name in copy or alternative text.

## Homepage placement

Add a full-width editorial photo band after the existing event-facts grid and before “What’s happening.” This puts authentic community proof near the top without replacing the poster hero or delaying the essential date, time, location, and admission details.

Content:

- Eyebrow: “From last year’s festival”
- Heading: “Pearland comes together.”
- Supporting copy: “Families, neighbors, and local businesses filled the Town Center for an afternoon of costumes, candy, and community.”
- Supporting statistic: “4,000+ attended”

On wide screens, `schf3.jpeg` will form the main image and `schf5.jpeg` and `schf6.jpeg` will appear as smaller editorial accents. On narrow screens, the content will become a straightforward stack: text, primary image, then the two supporting images. Important copy will remain outside the photographs so it stays readable regardless of crop.

## Business-page placement

Replace the abstract `Vend / Shop / Eat / Meet` quadrant in the existing vendor-opportunities section with a two-image editorial composition using `schf1.jpeg` and `schf2.jpeg`. The existing vending copy and inquiry button remain unchanged. The images should demonstrate variety and booth presentation without reframing the overall festival as a sneaker-focused event.

The image composition will be two columns on wide screens and stack on narrow screens. Fixed aspect-ratio wrappers and `object-fit: cover` will keep the screenshot arrows and unrelated people outside the visible crop.

## Asset handling

Store the original approved images under `src/assets/event-photos/` so Astro can process them during the static build. Render responsive local images with explicit dimensions and modern optimized output. All five images will load lazily because both placements follow their page's introductory content.

Keep image metadata in `src/data/eventPhotos.ts`, grouped by homepage and business-page use. Each entry will include the imported asset and meaningful alternative text. The two layouts will use page-specific markup because their visual roles differ, while the data remains centralized for future replacement.

## Accessibility and responsive behavior

- Provide concise alternative text describing the event context, not clothing brands or assumptions about attendees.
- Do not place links or essential information inside the image compositions.
- Preserve existing text contrast and keyboard navigation.
- Prevent horizontal page overflow from 320 through 430 CSS pixels.
- Avoid autoplay, animation, carousel controls, and lightbox behavior.
- Respect intrinsic image dimensions to prevent layout shifts.

## Verification

- Add contract coverage confirming the five approved assets and both data groups are present while `schf4.jpeg` remains absent.
- Add rendered-site coverage for the homepage photo band, its heading and image alternative text, and the vendor-opportunity photographs.
- Extend browser checks to confirm both placements remain contained at the project's existing phone widths.
- Run the unit/rendered suite, Astro type/build checks, and the desktop/mobile Playwright suite before completion.

## Out of scope

- A standalone gallery page or gallery navigation item.
- A carousel, slider, modal, or lightbox.
- Publishing `schf4.jpeg`.
- Adding attendee names, testimonials, or vendor identities inferred from the photographs.
- Replacing the poster hero, venue map, sponsor wall, or future confirmed-vendor directory.
