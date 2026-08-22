# Space City Halloween Festival

A two-page event website built with Astro for the October 24, 2026 Space City Halloween Festival in Pearland, Texas.

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
- `/partners/` — sponsorship packages, vendor information, and inquiry form

## Form integration

The sponsor/vendor form is fully designed, conditionally validated, spam-honeypot protected, and prepared to send JSON. It intentionally does not claim to deliver submissions until a backend is configured.

Set `PUBLIC_INQUIRY_ENDPOINT` to the future Cloudflare endpoint URL. The browser will send a `POST` request with `Content-Type: application/json`. The payload is defined by `prepareInquiry()` in `src/lib/inquiry.ts` and currently uses `schemaVersion: 1`.

If the variable is absent, the form validates locally and directs the user to `spacecitycollective713@gmail.com` instead of showing a false success state.

## Production metadata

Set `SITE` to the final public origin, such as `https://festival.example.com`, so Astro can emit the canonical URL. Deployment and Cloudflare project configuration are intentionally left to the site owner.
# scc-halloweenfest
