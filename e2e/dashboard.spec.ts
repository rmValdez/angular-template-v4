import { test, expect } from '@playwright/test';

test.describe('Angular Dashboard Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('displays workspace overview and navigation links', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
