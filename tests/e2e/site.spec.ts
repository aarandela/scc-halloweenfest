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
  for (const path of ["/", "/partners/"]) {
    await page.goto(path);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
  }
});
