# Space City Halloween Festival

An Astro event website for the October 24, 2026 Space City Halloween Festival in Pearland, Texas.

## Local development

```sh
npm install
npm run dev
```

Run the automated checks and production build with:

```sh
npm test
npm run build
npm run test:e2e
```

Astro writes the static production output to `dist/`.

The end-to-end command builds the site, starts a local static server, and checks the desktop and mobile experiences in Chromium. If port 8000 is already serving `dist/`, run `PLAYWRIGHT_USE_EXISTING_SERVER=1 npx playwright test` instead.

## Routes

- `/` — public event guide
- `/vendors/` — filterable public vendor directory, redirected to `/` until the confirmed lineup is ready
- `/partners/` — sponsorship packages, vendor information, and inquiry form
- `/partners/thanks/` — no-index success page used to count completed inquiries

Vendor listings live in `src/data/vendors.ts`. Replace the sample objects with confirmed vendor details, then set `SHOW_VENDOR_DIRECTORY=true` to publish both the homepage preview and full directory. With the flag absent or false, no placeholder vendors or vendor-directory links are included in production.

Approved event photography can be added to `src/data/eventPhotos.ts`. The gallery is omitted entirely while that array is empty, so there are no public photo placeholders.

The site self-hosts Latin WOFF2 builds of Barlow Condensed Italic and Inter in `public/fonts/` under the included SIL Open Font License files. The public event page also ships an `.ics` calendar download and a Google Calendar link.

## Form integration

The sponsor/vendor form validates conditionally and submits directly to Web3Forms with a hidden bot-check field. Configure these environment variables in Cloudflare Pages under **Settings → Environment variables**:

- `PUBLIC_WEB3FORMS_ACCESS_KEY` — required for form delivery
- `PUBLIC_TURNSTILE_SITE_KEY` — optional Cloudflare Turnstile protection; when supplied, verification is required before submission

Use the same variables locally in `.env.local`; that file is ignored by Git. `.env.example` documents the expected configuration without storing live values.

If the Web3Forms key is absent, the form does not show a false success state and directs the visitor to the festival email address instead.

Successful submissions redirect to `/partners/thanks/`. Leave the Web3Forms dashboard **Redirect URL** blank because the site handles this after the API confirms delivery.

## Analytics and campaign attribution

Campaign URLs and naming conventions are in [`docs/tracking-links.md`](docs/tracking-links.md). Tagged visits are stored for the current browser session and included as non-personal hidden fields in Web3Forms submissions.

In Cloudflare:

1. Open the Pages project, choose **Metrics**, and enable **Web Analytics**. Cloudflare injects its page-view beacon on the next deployment.
2. Enable **Zaraz** for the site if custom event reporting is wanted. Connect an analytics destination such as GA4, then map the site's `zaraz.track` events to that destination.
3. Deploy again and test one tagged URL, one calendar or directions click, and one inquiry. Confirm the visit and `/partners/thanks/` page view in Web Analytics, the custom event in the Zaraz destination, and the `campaign_*` values in Web3Forms.

The site emits these anonymous custom events:

- `visit_cta_clicked`
- `calendar_added`
- `directions_cta_clicked`
- `directions_opened`
- `partner_cta_clicked`
- `packages_viewed`
- `inquiry_cta_clicked`
- `sponsor_link_clicked`
- `inquiry_submitted`
- `thank_you_cta_clicked`

No contact details or free-form inquiry text are sent to analytics.

## Production metadata

Set `SITE=https://spacecityhalloweenfest.com` in both the Production and Preview environments. The build also uses that origin as a safe default, so canonical links and social-image URLs remain absolute if the variable is accidentally omitted. The optimized 1200 × 630 sharing image lives at `public/og-image.jpg`.

Use account-level Cloudflare Bulk Redirects to keep one public host:

- `https://www.spacecityhalloweenfest.com` → `https://spacecityhalloweenfest.com` (`301`)
- `https://scc-halloweenfest.pages.dev` → `https://spacecityhalloweenfest.com` (`301`)

For both entries, enable **Preserve query string**, **Subpath matching**, and **Preserve path suffix**. Domain redirects cannot be implemented in a Pages `_redirects` file.

The repository includes `robots.txt`, `sitemap.xml`, and a branded `404.html`. If Cloudflare's Email Address Obfuscation is not wanted for the form's email fallback, turn it off under **Security → Settings** for the zone.

For Cloudflare Pages, use `npm run build` as the build command and `dist` as the output directory.
