import { expect, test } from '@playwright/test';

import { blocks } from './blocks-test-vector';
test.describe('/block page', () => {
  test.describe('Loads the block pages', () => {
    Object.keys(blocks).forEach((network: string) => {
      Object.keys((blocks as any)[network]).forEach((type: string) => {
        (blocks as any)[network][type].forEach((hash: string) => {
          test(`block type ${type} with hash=${hash} on network=${network}`, async ({ page }) => {
            await page.goto(`/block/${hash}?chain=${network}`);
            await expect(page.locator('[data-test=tx-item')).toBeTruthy();
          });
        });
      });
    });
  });
});
