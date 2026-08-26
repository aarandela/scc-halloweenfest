import { expect, test } from "@playwright/test";

const parseRgb = (color: string) => {
  const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) throw new Error(`Unsupported color: ${color}`);
  return channels;
};

const relativeLuminance = (color: string) => {
  const [red = 0, green = 0, blue = 0] = parseRgb(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
};

test("the vendor call to action opens a vendor-ready form", async ({ page }) => {
  await page.goto("/partners/");
  await page.getByRole("link", { name: /ask about vending/i }).click();

  await expect(page).toHaveURL(/interest=vendor/);
  await expect(page.getByRole("radio", { name: /vending/i })).toBeChecked();
  await expect(page.getByLabel(/what does your business offer/i)).toBeVisible();
  await expect(page.getByLabel(/sponsorship level/i)).toBeHidden();

  await page.getByLabel(/what does your business offer/i).selectOption("Other");
  await expect(page.getByLabel(/describe what your business offers/i)).toBeVisible();
});

test("the inquiry form validates conditionally and sends through Web3Forms", async ({ page }) => {
  await page.route("https://api.web3forms.com/submit", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, message: "Email sent successfully!" })
    });
  });
  await page.goto("/partners/?interest=vendor#inquiry");
  await page.getByRole("button", { name: /send interest form/i }).click();

  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(page.getByText("Choose the category that best fits your business.")).toBeVisible();

  await page.getByLabel(/your name/i).fill("Jamie Rivera");
  await page.getByLabel(/business name/i).fill("Pearland Vintage");
  await page.getByLabel(/^email/i).fill("jamie@example.com");
  await page.getByLabel(/what does your business offer/i).selectOption("Retail & merchandise");
  await page.getByLabel(/space city collective may contact me/i).check();
  await page.locator('input[name="access_key"]').evaluate((input) => {
    if (input instanceof HTMLInputElement) input.value = "test-access-key";
  });
  await page.locator("[data-inquiry-form]").evaluate((form) => {
    if (form instanceof HTMLFormElement) {
      form.dataset.configured = "true";
      form.dataset.requiresTurnstile = "false";
    }
  });
  await page.getByRole("button", { name: /send interest form/i }).click();

  await expect(page).toHaveURL(/\/partners\/thanks\/$/);
  await expect(page.getByRole("heading", { name: /we received your inquiry/i })).toBeVisible();
});

test("the inquiry submission normalizes values and omits inactive fields", async ({ page }) => {
  let submittedBody = "";
  await page.route("https://api.web3forms.com/submit", async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true })
    });
  });

  await page.goto("/partners/?interest=vendor#inquiry");
  await page.getByLabel(/your name/i).fill("  Jamie Rivera  ");
  await page.getByLabel(/business name/i).fill("  Pearland Neighbors  ");
  await page.getByLabel(/^email/i).fill("  JAMIE@EXAMPLE.COM  ");
  await page.getByLabel(/what does your business offer/i).selectOption("Other");
  await page.getByLabel(/describe what your business offers/i).fill("  Kids activity booth  ");

  await page.getByRole("radio", { name: /sponsorship/i }).check();
  await page.getByLabel(/sponsorship level/i).selectOption("community-supporter");
  await page.getByLabel(/space city collective may contact me/i).check();
  await page.locator('input[name="access_key"]').evaluate((input) => {
    if (input instanceof HTMLInputElement) input.value = "test-access-key";
  });
  await page.locator("[data-inquiry-form]").evaluate((form) => {
    if (form instanceof HTMLFormElement) {
      form.dataset.configured = "true";
      form.dataset.requiresTurnstile = "false";
    }
  });

  await page.getByRole("button", { name: /send interest form/i }).click();
  await expect(page).toHaveURL(/\/partners\/thanks\/$/);

  expect(submittedBody).toContain('name="contactName"\r\n\r\nJamie Rivera');
  expect(submittedBody).toContain('name="email"\r\n\r\njamie@example.com');
  expect(submittedBody).toContain('name="sponsorTier"\r\n\r\ncommunity-supporter');
  expect(submittedBody).not.toContain('name="vendorCategory"');
  expect(submittedBody).not.toContain('name="vendorOtherDescription"');
});

test("campaign tags survive internal navigation and reach the inquiry form", async ({ page }) => {
  await page.goto(
    "/?utm_source=instagram&utm_medium=social&utm_campaign=halloween-2026&utm_content=costume-contest-post"
  );
  await page.locator(".poster-hero").getByRole("link", { name: /partner with us/i }).click();

  await expect(page.locator('input[name="campaign_source"]')).toHaveValue("instagram");
  await expect(page.locator('input[name="campaign_medium"]')).toHaveValue("social");
  await expect(page.locator('input[name="campaign_name"]')).toHaveValue("halloween-2026");
  await expect(page.locator('input[name="campaign_content"]')).toHaveValue("costume-contest-post");
  await expect(page.locator('input[name="campaign_landing_page"]')).toHaveValue("/");
});

test("the pages do not overflow the viewport", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ["/", "/vendors/", "/partners/", "/partners/thanks/"]) {
      await page.goto(path);
      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflows, `${path} overflows at ${width}px`).toBe(false);
    }
  }
});

test("small venue and footer text meets WCAG AA contrast", async ({ page }) => {
  await page.goto("/");

  for (const selector of [
    ".venue-section .eyebrow",
    ".footer-note",
    ".footer-links a",
    ".footer-links span",
    ".footer-bottom > span:first-child",
    ".footer-bottom > span:nth-child(2)"
  ]) {
    const colors = await page.locator(selector).first().evaluate((element) => {
      let ancestor: Element | null = element;
      let background = "rgba(0, 0, 0, 0)";

      while (ancestor) {
        const candidate = getComputedStyle(ancestor).backgroundColor;
        if (candidate !== "rgba(0, 0, 0, 0)") {
          background = candidate;
          break;
        }
        ancestor = ancestor.parentElement;
      }

      return {
        foreground: getComputedStyle(element).color,
        background
      };
    });

    expect(
      contrastRatio(colors.foreground, colors.background),
      `${selector} does not meet the 4.5:1 contrast requirement`
    ).toBeGreaterThanOrEqual(4.5);
  }
});

test("event photography remains contained at common phone widths", async ({ page }) => {
  for (const width of [320, 375, 430]) {
    await page.setViewportSize({ width, height: 844 });

    for (const [path, selector] of [
      ["/", "[data-community-photo-band]"],
      ["/partners/", "[data-vendor-photo-story]"]
    ] as const) {
      await page.goto(path);
      const composition = page.locator(selector);
      await expect(composition).toBeVisible();

      const layout = await composition.evaluate((element) => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        images: Array.from(element.querySelectorAll("img"), (image) => {
          const bounds = image.getBoundingClientRect();
          return { left: bounds.left, right: bounds.right, height: bounds.height };
        })
      }));

      expect(layout.documentWidth, `${path} overflows at ${width}px`).toBeLessThanOrEqual(layout.viewportWidth);
      for (const image of layout.images) {
        expect(image.left, `${path} image crosses the left edge at ${width}px`).toBeGreaterThanOrEqual(0);
        expect(image.right, `${path} image crosses the right edge at ${width}px`).toBeLessThanOrEqual(width);
        if (path === "/partners/") {
          expect(image.height, `${path} image is not deliberately cropped at ${width}px`).toBeLessThanOrEqual(320);
        }
      }
    }
  }
});

test("the community photo story keeps its headline inside a balanced desktop column", async ({ page }) => {
  for (const width of [1024, 1440, 1600, 2048]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const layout = await page.locator("[data-community-photo-band]").evaluate((section) => {
      const heading = section.querySelector("h2");
      const photos = section.querySelector(".community-photo-composition");
      if (!(heading instanceof HTMLElement) || !(photos instanceof HTMLElement)) {
        throw new Error("Community photo story is incomplete");
      }

      const headingBox = heading.getBoundingClientRect();
      const photoBox = photos.getBoundingClientRect();
      return {
        headingClientWidth: heading.clientWidth,
        headingScrollWidth: heading.scrollWidth,
        visualGap: photoBox.left - (headingBox.left + heading.scrollWidth)
      };
    });

    expect(layout.headingScrollWidth, `headline overflows its column at ${width}px`).toBeLessThanOrEqual(layout.headingClientWidth + 1);
    expect(layout.visualGap, `headline crowds the photography at ${width}px`).toBeGreaterThanOrEqual(48);
  }
});

test("audience highlight lists use a drawn pumpkin marker", async ({ page }) => {
  await page.goto("/");

  const marker = await page.locator(".chip-list li").first().evaluate((item) => {
    const body = getComputedStyle(item, "::before");
    const stem = getComputedStyle(item, "::after");
    return {
      bodyContent: body.content,
      bodyWidth: Number.parseFloat(body.width),
      bodyHeight: Number.parseFloat(body.height),
      bodyColor: body.backgroundColor,
      stemContent: stem.content,
      stemColor: stem.backgroundColor
    };
  });

  expect(marker.bodyContent).toBe('\"\"');
  expect(marker.bodyWidth).toBeGreaterThanOrEqual(10);
  expect(marker.bodyHeight).toBeGreaterThanOrEqual(8);
  expect(marker.bodyColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(marker.stemContent).toBe('\"\"');
  expect(marker.stemColor).not.toBe("rgba(0, 0, 0, 0)");
});

test("the homepage hero has no accidental center seam", async ({ page }) => {
  await page.goto("/");

  const background = await page.locator(".poster-hero").evaluate((hero) =>
    getComputedStyle(hero, "::before").backgroundImage
  );

  expect(background).not.toContain("49.8%");
});

test("the supplied header artwork is visually centered in its crop", async ({ page }) => {
  await page.goto("/");

  const focalPoint = await page.locator(".site-header .brand-logo-crop").evaluate(async (cropElement) => {
    const crop = cropElement.getBoundingClientRect();
    const image = cropElement.querySelector("img");

    if (!(image instanceof HTMLImageElement)) throw new Error("Header logo image is missing");
    await image.decode();

    const imageBox = image.getBoundingClientRect();
    const scaleX = imageBox.width / image.naturalWidth;
    const scaleY = imageBox.height / image.naturalHeight;

    return {
      x: (crop.left + crop.width / 2 - imageBox.left) / scaleX,
      y: (crop.top + crop.height / 2 - imageBox.top) / scaleY
    };
  });

  // Visual center of the wordmark/alien lockup in the supplied 438px artwork.
  expect(Math.abs(focalPoint.x - 256)).toBeLessThanOrEqual(2);
  expect(Math.abs(focalPoint.y - 126)).toBeLessThanOrEqual(2);
});

test("the supplied JPG background blends into the dark header", async ({ page }) => {
  await page.goto("/");
  const backgroundLuminance = await page.locator(".site-header .brand-logo-crop img").evaluate(async (image) => {
    if (!(image instanceof HTMLImageElement)) throw new Error("Header logo image is missing");
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas context is unavailable");
    context.filter = getComputedStyle(image).filter;
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const samplePoints = [[0, 0], [220, 10], [10, 220], [420, 420], [400, 50], [50, 400]];
    const samples = samplePoints.map(([x = 0, y = 0]) => {
      const index = (y * canvas.width + x) * 4;
      return Math.max(pixels[index] ?? 0, pixels[index + 1] ?? 0, pixels[index + 2] ?? 0);
    });
    return samples.reduce((total, sample) => total + sample, 0) / samples.length;
  });

  expect(backgroundLuminance).toBeLessThan(32);
});

test("display headlines keep safe line spacing", async ({ page }) => {
  for (const [path, selector] of [["/", ".poster-hero h1"], ["/partners/", ".partner-hero h1"]] as const) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const ratio = await page.locator(selector).evaluate((heading) => {
      const styles = getComputedStyle(heading);
      return Number.parseFloat(styles.lineHeight) / Number.parseFloat(styles.fontSize);
    });
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  }
});

test("the mobile home headline respects the page gutter", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 720, "Mobile-only layout check");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const bounds = await page.locator(".poster-hero h1").evaluate((heading) => {
    const box = heading.getBoundingClientRect();
    return { left: box.left, right: box.right, viewport: window.innerWidth };
  });

  expect(bounds.left).toBeGreaterThanOrEqual(8);
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewport - 8);
});

test("mobile display type stays open and readable", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 720, "Mobile-only typography check");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  for (const selector of [".event-bill h2", ".program-heading h2"]) {
    const typography = await page.locator(selector).evaluate((heading) => {
      const styles = getComputedStyle(heading);
      const fontSize = Number.parseFloat(styles.fontSize);
      return {
        family: styles.fontFamily,
        lineHeightRatio: Number.parseFloat(styles.lineHeight) / fontSize,
        trackingRatio: Number.parseFloat(styles.letterSpacing) / fontSize
      };
    });

    expect(typography.family).toContain("Barlow Condensed");
    expect(typography.lineHeightRatio).toBeGreaterThanOrEqual(0.88);
    expect(typography.trackingRatio).toBeGreaterThanOrEqual(-0.02);
  }
});

test("mobile visitors can reach every primary destination from the header", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 920, "Mobile-only navigation check");
  await page.goto("/");
  await page.getByText("Menu", { exact: true }).click();

  const mobileNavigation = page.locator(".mobile-nav nav");
  await expect(mobileNavigation.getByRole("link", { name: "Event guide" })).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "Vendors" })).toHaveCount(0);
  await expect(mobileNavigation.getByRole("link", { name: "For businesses" })).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "FAQ" })).toBeVisible();
});

test("the desktop impact band has vertical breathing room", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 720, "Desktop spacing check");
  await page.goto("/");
  const padding = await page.locator(".impact-inner").evaluate((band) => {
    const styles = getComputedStyle(band);
    return {
      top: Number.parseFloat(styles.paddingTop),
      bottom: Number.parseFloat(styles.paddingBottom)
    };
  });

  expect(padding.top).toBeGreaterThanOrEqual(32);
  expect(padding.bottom).toBeGreaterThanOrEqual(32);
});

test("the unpublished vendor directory redirects without exposing samples", async ({ page }) => {
  await page.goto("/vendors/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("Sample lineup for demonstration")).toHaveCount(0);
});

test("unknown routes return the branded page with a real 404 status", async ({ page }) => {
  const response = await page.goto("/nope");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /this page wandered off/i })).toBeVisible();
});
