# Space City Halloween Festival

A three-page event website built with Astro for the October 24, 2026 Space City Halloween Festival in Pearland, Texas.

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
- `/vendors/` — filterable public vendor directory
- `/partners/` — sponsorship packages, vendor information, and inquiry form

Placeholder vendor listings live in `src/data/vendors.ts`. Replace each sample object with confirmed vendor details as the roster arrives; the homepage preview and full directory read from the same data source.

The site self-hosts Latin WOFF2 builds of Anton and Inter in `public/fonts/` under the included SIL Open Font License files. The public event page also ships an `.ics` calendar download and a Google Calendar link.

## Form integration

The sponsor/vendor form is fully designed, conditionally validated, spam-honeypot protected, and prepared to send JSON. It intentionally does not claim to deliver submissions until a backend is configured.

Set `PUBLIC_INQUIRY_ENDPOINT` to the future Cloudflare endpoint URL. The browser will send a `POST` request with `Content-Type: application/json`. The payload is defined by `prepareInquiry()` in `src/lib/inquiry.ts` and currently uses `schemaVersion: 1`.

If the variable is absent, the form validates locally and directs the user to `spacecitycollective713@gmail.com` instead of showing a false success state.

## Production metadata

Set `SITE` to the final public origin, such as `https://festival.example.com`, so Astro can emit canonical and absolute social-image URLs. The 1200 × 630 sharing image lives at `public/og-image.png`. Deployment and Cloudflare project configuration are intentionally left to the site owner.
# scc-halloweenfest
