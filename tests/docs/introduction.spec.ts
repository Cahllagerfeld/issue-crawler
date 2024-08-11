/* eslint-disable @typescript-eslint/no-empty-function */
import { expect, test } from '@playwright/test';

test('Docs header element is active', async ({ page }) => {
  // navigate to the docs landing page /docs
  await page.goto('/docs');

  // check if the docs link in the page header is having the active class
  await expect(page.getByRole('link', { name: 'Docs' })).toHaveClass(/active/);
});

test('Page Heading is correct', async ({ page }) => {
  // navigate to the docs landing page /docs
  await page.goto('/docs');

  // check if the heading contains Introduction
  expect(await page.textContent('h1')).toBe('Introduction');
});

test('Introduction element is highlighted as orange', async ({ page }) => {
  // navigate to the docs landing page /docs
  await page.goto('/docs');

  // check the Introduction element has orange color
  const introElement = page.getByRole('link', { name: 'Docs' });
  const introElementColor = await introElement.evaluate((element) =>
    window.getComputedStyle(element).getPropertyValue('--primary-100'),
  );
  await expect(introElementColor).toEqual('#ff5a00');
});

test('Introduction element has the same name as the page headline', async ({ page }) => {
  // navigate to the docs landing page /docs
  await page.goto('/docs');

  // check if both elements - first left menu element and page header have the same name
  const pageHeadlineName = await page.textContent('h1');
  const introElement = await page.locator('.space-y-4 .active').innerHTML();
  const introElementName = introElement.toString();
  expect(introElementName).toEqual(pageHeadlineName);
});

test('Introduction element is highlighted as yellow when hovered-over', async ({ page }) => {
  // navigate to the docs landing page /docs/testing
  await page.goto('/docs/testing');

  // check the Introduction element on hover has yellow color
  const introElement = await page.getByRole('link', { name: 'Docs' });
  await introElement.hover();
  const introElementAfterHover = await page.getByRole('link', { name: 'Docs' });
  const introElementColorOnHover = await introElementAfterHover.evaluate((element) =>
    window.getComputedStyle(element).getPropertyValue('--primary-300'),
  );
  await expect(introElementColorOnHover).toEqual('#ffbf00');
});
