import { expect, test } from '@playwright/test';

import { txs } from './transactions-test-vector';
test.describe('/txid page', () => {
  test.describe('Loads the transactions txid pages', () => {
    Object.keys(txs).forEach(network => {
      console.log('network', network);
      Object.keys(txs[network]).forEach(type => {
        txs[network][type].forEach(txid => {
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
