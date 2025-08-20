import { test, expect } from '@playwright/test';

test('catalog filter by search narrows results', async ({ page }) => {
  await page.goto('/catalog');
  const search = page.getByPlaceholder(/search/i).or(page.locator('input[type="search"]')).first();
  await search.fill('Musala');
  // A dedicated filter apply button or automatic filtering; try both
  const apply = page.getByRole('button', { name: /apply|filter/i });
  if (await apply.count() > 0) await apply.first().click();

  // Expect a card/text with 'Musala'
  await expect(page.getByText(/Musala/i)).toBeVisible();
});