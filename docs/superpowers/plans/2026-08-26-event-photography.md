# Event Photography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Embed five approved photos into the existing homepage and business page with responsive, optimized delivery and no new route.

**Architecture:** Keep imported image metadata and alternative text in `src/data/eventPhotos.ts`, split into community and vendor groups. Render a dedicated community photo band in `src/pages/index.astro` and replace the abstract vendor quadrant in `src/pages/partners.astro` with a vendor photo composition. Astro's local image pipeline will produce responsive optimized assets while CSS owns cropping and layout.

**Tech Stack:** Astro 7, TypeScript, Astro `Image`, CSS Grid, Vitest, Playwright

---

### Task 1: Approved asset inventory and photo data

**Files:**
- Create: `src/assets/event-photos/schf1.jpeg`
- Create: `src/assets/event-photos/schf2.jpeg`
- Create: `src/assets/event-photos/schf3.jpeg`
- Create: `src/assets/event-photos/schf5.jpeg`
- Create: `src/assets/event-photos/schf6.jpeg`
- Modify: `src/data/eventPhotos.ts`
- Modify: `tests/site-contract.test.ts`

- [ ] **Step 1: Write the failing asset contract**

Add a test that expects the five approved files, rejects `schf4.jpeg`, and checks that `eventPhotos.ts` exports `communityPhotos` and `vendorPhotos`.

```ts
it("ships only approved event photography in audience-specific groups", () => {
  for (const name of ["schf1.jpeg", "schf2.jpeg", "schf3.jpeg", "schf5.jpeg", "schf6.jpeg"]) {
    expect(existsSync(`src/assets/event-photos/${name}`)).toBe(true);
  }
  expect(existsSync("src/assets/event-photos/schf4.jpeg")).toBe(false);

  const photoData = readFileSync("src/data/eventPhotos.ts", "utf8");
  expect(photoData).toContain("export const communityPhotos");
  expect(photoData).toContain("export const vendorPhotos");
});
```

- [ ] **Step 2: Run the contract and verify RED**

Run: `npm test -- --run tests/site-contract.test.ts`

Expected: FAIL because the five assets and grouped exports do not exist.

- [ ] **Step 3: Add the approved assets and grouped metadata**

Copy photos 1, 2, 3, 5, and 6 from `/Users/audyarandela/Downloads/` into `src/assets/event-photos/`. Do not copy photo 4.

Replace `src/data/eventPhotos.ts` with imported `ImageMetadata` entries:

```ts
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
  { src: schf3, alt: "Families gathering around the Methodist Pavilion during last year's festival" },
  { src: schf5, alt: "Festival visitors meeting community vendors under the pavilion" },
  { src: schf6, alt: "Visitors trick-or-treating at a participating Pearland Town Center store" }
];

export const vendorPhotos: readonly EventPhoto[] = [
  { src: schf1, alt: "Apparel and accessories displayed at a festival vendor booth" },
  { src: schf2, alt: "Sneakers displayed across a festival vendor table" }
];
```

- [ ] **Step 4: Run the contract and verify GREEN**

Run: `npm test -- --run tests/site-contract.test.ts`

Expected: all site-contract tests PASS.

- [ ] **Step 5: Commit the asset/data slice**

```bash
git add src/assets/event-photos src/data/eventPhotos.ts tests/site-contract.test.ts
git commit -m "add approved festival photography"
```

### Task 2: Homepage community photo band

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/rendered-site.test.ts`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write the failing rendered and responsive tests**

Build the site in the test setup and assert that `/index.html` includes one `[data-community-photo-band]`, the approved heading and statistic, and exactly three community image alternative texts.

```ts
expect(home).toContain("data-community-photo-band");
expect(home).toContain("Pearland comes together.");
expect(home).toContain("4,000+ attended");
expect(home).toContain("Families gathering around the Methodist Pavilion");
expect(home).toContain("Festival visitors meeting community vendors");
expect(home).toContain("Visitors trick-or-treating at a participating Pearland Town Center store");
```

Add a Playwright test that sets widths 320, 375, and 430, visits `/` and `/partners/`, requires the page-specific photo composition to be visible, and asserts that neither the image bounds nor the document exceed the viewport.

- [ ] **Step 2: Run both focused tests and verify RED**

Run: `npm test -- --run tests/rendered-site.test.ts`

Expected: FAIL because the photo band is absent.

Run: `npm run build && npx playwright test -g "event photography remains contained" --workers=1 --reporter=line`

Expected: FAIL because `[data-community-photo-band]` and `[data-vendor-photo-story]` are absent.

- [ ] **Step 3: Render the photo band after the event facts**

Import `Image` from `astro:assets` and `communityPhotos` from the data file. Add a `section.community-photo-band[data-community-photo-band]` between the fact grid and “What’s happening.” Render the first photo as the large image with `widths={[640, 960, 1280, 1600]}` and `sizes="(max-width: 720px) 100vw, 64vw"`. Render the two accent images with `widths={[320, 480, 640, 800]}` and `sizes="(max-width: 720px) 50vw, 20vw"`. Every image uses `layout="full-width"`, `format="webp"`, and `loading="lazy"`.

Use the approved copy:

```html
<p class="eyebrow">From last year’s festival</p>
<h2>Pearland comes together.</h2>
<p>Families, neighbors, and local businesses filled the Town Center for an afternoon of costumes, candy, and community.</p>
<strong>4,000+ attended</strong>
```

- [ ] **Step 4: Add desktop and mobile presentation**

Create a desktop grid with copy beside a dominant image and two smaller image tiles. At `max-width: 720px`, stack copy, main image, and a two-column supporting grid. Keep every wrapper overflow-hidden and use `object-fit: cover`; do not overlay essential copy on an image.

- [ ] **Step 5: Run the rendered test and record the partial GREEN state**

Run: `npm test -- --run tests/rendered-site.test.ts`

Expected: all rendered-site tests PASS.

The focused Playwright test still fails on `/partners/` because Task 3 has not added the vendor composition yet; this is the expected intermediate state.

- [ ] **Step 6: Commit the homepage slice**

```bash
git add src/pages/index.astro src/styles/global.css tests/rendered-site.test.ts tests/e2e/site.spec.ts
git commit -m "add community photo band"
```

### Task 3: Business-page vendor photography

**Files:**
- Modify: `src/pages/partners.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/rendered-site.test.ts`

- [ ] **Step 1: Write the failing business-page test**

Assert that the rendered partner page includes `[data-vendor-photo-story]`, both vendor-photo alternative texts, and no `class="vendor-type"` quadrant.

```ts
expect(partners).toContain("data-vendor-photo-story");
expect(partners).toContain("Apparel and accessories displayed at a festival vendor booth");
expect(partners).toContain("Sneakers displayed across a festival vendor table");
expect(partners).not.toContain('class="vendor-type"');
```

- [ ] **Step 2: Run the rendered test and verify RED**

Run: `npm test -- --run tests/rendered-site.test.ts`

Expected: FAIL because the vendor photo story is absent and the quadrant remains.

- [ ] **Step 3: Replace the abstract quadrant**

Import `Image` and `vendorPhotos`, then render two lazy WebP images with `widths={[360, 540, 720, 900]}`, `sizes="(max-width: 720px) 100vw, 28vw"`, and `layout="full-width"` inside `[data-vendor-photo-story]`. Preserve the existing vendor heading, copy, and inquiry CTA exactly.

- [ ] **Step 4: Crop the merchandise images responsively**

Use fixed aspect-ratio wrappers, `overflow: hidden`, and lower `object-position` values so the screenshot navigation arrows and unrelated attendees remain outside the visible composition. Keep two columns on desktop and stack the images at `max-width: 720px`.

- [ ] **Step 5: Run rendered and responsive tests and verify GREEN**

Run: `npm test -- --run tests/rendered-site.test.ts`

Expected: all rendered-site tests PASS.

Run: `npm run build && npx playwright test -g "event photography remains contained" --workers=1 --reporter=line`

Expected: the focused desktop and mobile Playwright cases PASS.

- [ ] **Step 6: Commit the business-page slice**

```bash
git add src/pages/partners.astro src/styles/global.css tests/rendered-site.test.ts
git commit -m "show vendor photography on business page"
```

### Task 4: Final browser and build verification

- [ ] **Step 1: Make only responsive corrections exposed by the test**

Adjust the photo-band and vendor-photo media queries only if the focused test reports overflow or hidden content. Do not change the approved placement or add interactive gallery behavior.

- [ ] **Step 2: Run complete verification**

Run:

```bash
npm test
npm run build
npx playwright test --workers=1 --reporter=line
git diff --check
```

Expected: 0 failing Vitest tests, 0 Astro diagnostics, 0 failing Playwright tests, and no whitespace errors.

- [ ] **Step 3: Inspect optimized output**

Confirm generated photo assets in `dist/_astro/` are WebP files and that the built homepage and partner page contain responsive `srcset` attributes. Visually inspect desktop and 320/390/430-pixel screenshots for intentional crops.

- [ ] **Step 4: Commit responsive corrections when Step 1 changed files**

```bash
git add tests/e2e/site.spec.ts src/styles/global.css
git commit -m "verify responsive event photography"
```

If Step 1 required no correction, skip this commit because the feature slices are already committed.
