import { test, expect } from '@playwright/test';

test('catalog loads and shows seeded hikes', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page.locator('h1, h2, .title')).toBeVisible();
  // App cards have titles in catalog; expect at least one of the seeded titles to appear
  const titles = ['Vitosha Ring', 'Rila Seven Lakes', 'Musala'];
  const anyVisible = await Promise.any(titles.map(t => page.getByText(t, { exact: false }).isVisible().then(v => v)));
  expect(anyVisible).toBe(true);
});