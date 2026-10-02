const { test, expect } = require('@playwright/test');

// This test assumes the dev server is running at http://localhost:3000
test('adding a product and undoing it updates the cart badge', async ({ page }) => {
  await page.goto('http://localhost:3000/products/1');

  await page.locator('button:has-text("In den Warenkorb")').waitFor({ state: 'visible', timeout: 5000 });

  await page.click('button[aria-label="Menge erhöhen"]');

  await page.click('button:has-text("In den Warenkorb")');

  const badge = page.locator('a[href="/cart"] .bg-emerald-700');
  await expect(badge).toHaveText('2');

  const undoBtn = page.locator('button:has-text("Rückgängig")');
  await undoBtn.waitFor({ state: 'visible', timeout: 3000 });
  await undoBtn.click();

  await expect(badge).toHaveCount(0);
});
