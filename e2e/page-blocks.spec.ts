import { test } from '@playwright/test';
import { hasBlocks } from './block-utils';

test.describe('/blocks page', () => {
  test('intial load mainnet', async ({ page }) => {
    await page.goto(`/blocks`);
    await hasBlocks(page);
  });

  test('intial load testnet', async ({ page }) => {
    await page.goto(`/blocks?chain=testnet`);
    await hasBlocks(page);
  });
});
