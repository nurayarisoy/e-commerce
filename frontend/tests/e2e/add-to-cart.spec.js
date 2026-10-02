const { test, expect } = require('@playwright/test');

// Simple e2e that assumes dev server is running at http://localhost:3000
test('adding a product updates the cart badge', async ({ page }) => {
  await page.goto('http://localhost:3000/products/1');

  await page.locator('button:has-text("In den Warenkorb")').waitFor({ state: 'visible', timeout: 5000 });

  await page.click('button[aria-label="Menge erhöhen"]');

  await page.click('button:has-text("In den Warenkorb")');

  const badge = page.locator('a[href="/cart"] span');
  await expect(badge).toHaveText('2');
});
