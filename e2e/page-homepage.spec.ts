import { expect, Page, test } from '@playwright/test';
import { hasBlocks } from './block-utils';

const txTypes = [
  'token_transfer',
  'smart_contract',
  'contract_call',
  'poison_microblock',
  'coinbase',
];

function hasTransactions(page) {
  const selectors = txTypes.map(type => `[data-test=${type}-transaction]`);
  return page.waitForSelector(selectors.join(', '));
}

async function hasPendingTransactions(page: Page) {
  await page.waitForSelector('[data-test=tx-caption]');
  const count = await page.locator('[data-test=tx-caption]', { hasText: 'Pending' }).count();
  expect(count).toBeGreaterThan(0);
}

test.describe('/ homepage', () => {
  test.describe('Loads the home page', () => {
    test('intial load', async ({ page }) => {
      await page.goto(`/`);
      await expect(page.locator('[data-test=homepage-title]')).toBeTruthy();
      await hasTransactions(page);
      await hasBlocks(page);
      await page.locator('button:has-text("Pending")').click();
      await hasPendingTransactions(page);
    });
  });
});
