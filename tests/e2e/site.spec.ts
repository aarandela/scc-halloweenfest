import { expect, test } from "@playwright/test";

test("the vendor call to action opens a vendor-ready form", async ({ page }) => {
  await page.goto("/partners/");
  await page.getByRole("link", { name: /ask about vending/i }).click();

  await expect(page).toHaveURL(/interest=vendor/);
  await expect(page.getByRole("radio", { name: /vending/i })).toBeChecked();
  await expect(page.getByLabel(/what does your business offer/i)).toBeVisible();
  await expect(page.getByLabel(/sponsorship level/i)).toBeHidden();
});

test("the inquiry form validates conditionally and never fakes delivery", async ({ page }) => {
  await page.goto("/partners/?interest=vendor#inquiry");
  await page.getByRole("button", { name: /send interest form/i }).click();

  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(page.getByText("Tell us what your business offers.")).toBeVisible();

  await page.getByLabel(/your name/i).fill("Jamie Rivera");
  await page.getByLabel(/business name/i).fill("Pearland Vintage");
  await page.getByLabel(/^email/i).fill("jamie@example.com");
  await page.getByLabel(/what does your business offer/i).fill("Vintage clothing");
  await page.getByLabel(/space city collective may contact me/i).check();
  await page.getByRole("button", { name: /send interest form/i }).click();

  await expect(page.getByRole("status")).toContainText("Online delivery is being connected");
  await expect(page.getByRole("status")).not.toContainText("received your inquiry");
});

test("the pages do not overflow the viewport", async ({ page }) => {
  for (const path of ["/", "/vendors/", "/partners/"]) {
    await page.goto(path);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
  }
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
  await expect(mobileNavigation.getByRole("link", { name: "Vendors" })).toBeVisible();
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

test("vendor categories filter the directory and create shareable URLs", async ({ page }) => {
  await page.goto("/vendors/");
  await page.getByRole("button", { name: "Food & drink" }).click();

  await expect(page.locator("[data-vendor-card]:visible")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Food & drink" })).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/category=Food/);

  await page.goto("/vendors/?category=Vintage");
  await expect(page.locator("[data-vendor-card]:visible")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Vintage" })).toHaveAttribute("aria-pressed", "true");
});
