import { test, expect } from '@playwright/test';

test('demo user login works', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('demo@trailmix.dev');
  await page.getByLabel(/password/i).fill('demopass');
  // Click submit (button with text Login)
  await Promise.race([
    page.getByRole('button', { name: /log in|login/i }).click(),
    page.getByRole('button', { name: /sign in/i }).click()
  ]).catch(() => {});

  // Expect nav or page to show user area (e.g., Create or Profile link)
  const hasCreate = await page.getByRole('link', { name: /create/i }).isVisible().catch(() => false);
  const hasProfile = await page.getByRole('link', { name: /profile/i }).isVisible().catch(() => false);
  expect(hasCreate || hasProfile).toBe(true);
});