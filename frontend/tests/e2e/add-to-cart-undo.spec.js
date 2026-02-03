const { test, expect } = require('@playwright/test');

// This test assumes the dev server is running at http://localhost:3000
test('add to cart then undo reduces navbar badge', async ({ page }) => {
  await page.goto('http://localhost:3000/products/1');

  // Wait for AddToCartButton to appear
  await page.locator('button:has-text("Sepete ekle")').waitFor({ state: 'visible', timeout: 5000 });

  // Increase qty once (so qty becomes 2)
  await page.click('button[aria-label="Arttır"]');

  // Click Sepete ekle
  await page.click('button:has-text("Sepete ekle")');

  // Badge element (badge uses bg-red-600 class)
  const badge = page.locator('a[href="/cart"] .bg-red-600');
  await expect(badge).toHaveText('2');

  // Wait for undo toast button and click it
  const undoBtn = page.locator('button:has-text("Geri al")');
  await undoBtn.waitFor({ state: 'visible', timeout: 3000 });
  await undoBtn.click();

  // After undo, badge should be removed
  await expect(badge).toHaveCount(0);
});
