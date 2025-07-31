import { expect, test } from '@playwright/test';

import { txs } from './transactions-test-vector';
test.describe('/txid page', () => {
  test.describe('Loads the transactions txid pages', () => {
    Object.keys(txs).forEach((network: string) => {
      Object.keys((txs as any)[network]).forEach((type: string) => {
        (txs as any)[network][type].forEach((txid: string) => {
          test(`transactions type ${type} with txid=${txid} on network=${network}`, async ({
            page,
          }) => {
            await page.goto(`/txid/${txid}?chain=${network}`);
            await expect(page.locator('[data-test=tx-title')).toBeTruthy();
          });
        });
      });
    });
  });
});
