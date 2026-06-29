const { test, expect } = require('@playwright/test');

// Simple e2e that assumes dev server is running at http://localhost:3000
test('add to cart updates navbar badge', async ({ page }) => {
  await page.goto('http://localhost:3000/products/1');

  // Wait for AddToCartButton to appear
  await page.locator('button:has-text("Sepete ekle")').waitFor({ state: 'visible', timeout: 5000 });

  // Increase qty once (so qty becomes 2)
  await page.click('button[aria-label="Arttır"]');

  // Click Sepete ekle (2)
  await page.click('button:has-text("Sepete ekle")');

  // Wait for the navbar badge to appear and assert it shows '2'
  const badge = page.locator('a[href="/cart"] span');
  await expect(badge).toHaveText('2');
});
