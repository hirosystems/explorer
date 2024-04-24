import { expect, test } from '@playwright/test';

import { blocks } from './blocks-test-vector';
test.describe('/block page', () => {
  test.describe('Loads the block pages', () => {
    Object.keys(blocks).forEach(network => {
      Object.keys(blocks[network]).forEach(type => {
        blocks[network][type].forEach(hash => {
          test(`block type ${type} with hash=${hash} on network=${network}`, async ({ page }) => {
            await page.goto(`/block/${hash}?chain=${network}`);
            await expect(page.locator('[data-test=tx-item')).toBeTruthy();
          });
        });
      });
    });
  });
});
