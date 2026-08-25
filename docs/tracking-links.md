# Campaign tracking links

Use a tagged URL whenever the festival website is shared. The site remembers the latest tagged visit for the browser session and includes it with a successful sponsor or vendor inquiry.

## Ready-to-use links

| Placement | URL |
| --- | --- |
| Instagram bio | `https://spacecityhalloweenfest.com/?utm_source=instagram&utm_medium=social&utm_campaign=halloween-2026&utm_content=bio` |
| Instagram general post | `https://spacecityhalloweenfest.com/?utm_source=instagram&utm_medium=social&utm_campaign=halloween-2026&utm_content=general-post` |
| Facebook page | `https://spacecityhalloweenfest.com/?utm_source=facebook&utm_medium=social&utm_campaign=halloween-2026&utm_content=page` |
| Facebook event | `https://spacecityhalloweenfest.com/?utm_source=facebook&utm_medium=social&utm_campaign=halloween-2026&utm_content=event-page` |
| TikTok profile | `https://spacecityhalloweenfest.com/?utm_source=tiktok&utm_medium=social&utm_campaign=halloween-2026&utm_content=profile` |
| YouTube description | `https://spacecityhalloweenfest.com/?utm_source=youtube&utm_medium=social&utm_campaign=halloween-2026&utm_content=video-description` |
| Printed flyer or poster QR code | `https://spacecityhalloweenfest.com/?utm_source=print&utm_medium=qr&utm_campaign=halloween-2026&utm_content=event-flyer` |
| Sponsor outreach email | `https://spacecityhalloweenfest.com/partners/?utm_source=email&utm_medium=outreach&utm_campaign=sponsorship-2026&utm_content=sponsor-invite` |
| Vendor outreach email | `https://spacecityhalloweenfest.com/partners/?interest=vendor&utm_source=email&utm_medium=outreach&utm_campaign=vendor-recruitment-2026&utm_content=vendor-invite#inquiry` |

## Make a different link for each post

Keep `utm_source`, `utm_medium`, and `utm_campaign` consistent. Change only `utm_content` to identify the post:

```text
https://spacecityhalloweenfest.com/?utm_source=instagram&utm_medium=social&utm_campaign=halloween-2026&utm_content=costume-contest-aug-30
```

```text
https://spacecityhalloweenfest.com/?utm_source=facebook&utm_medium=social&utm_campaign=halloween-2026&utm_content=vendor-lineup-sep-12
```

Use lowercase words separated by hyphens. Do not rename a source or campaign after links are already in use, or the reports will split one campaign into multiple rows.

## What the site records

- Page visits and the dedicated `/partners/thanks/` conversion page through Cloudflare Web Analytics.
- Calendar, directions, partner, package, sponsor-link, and successful-inquiry events through Cloudflare Zaraz when an analytics destination is connected.
- Campaign source, medium, campaign, post/content, and landing page in each Web3Forms inquiry.

Names, email addresses, phone numbers, business messages, and other form answers are not sent to analytics.

