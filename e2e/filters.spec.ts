import { expect, test } from '@playwright/test';

import { txs } from './mocks';

test.describe('Transaction page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/extended/v1/tx**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          results: txs,
        }),
      })
    );
    await page.goto('/transactions?chain=mainnet');
  });

  test.describe('Transaction filters', () => {
    test('that it should filter transactions based on type', async ({ page }) => {
      await page.click('[data-test=filter-button]');
      await expect(page.locator('[data-test=filter-panel]')).toBeVisible();
      await page.waitForTimeout(1000);

      // smart_contract filter
      await page.click(`[data-test=smart_contract]`);
      await expect(page.locator(`[data-test=smart_contract-transaction]`)).toBeHidden();
      await page.waitForTimeout(1000);

      // contract_call filter
      await page.click(`[data-test=contract_call]`);
      await expect(page.locator(`[data-test=contract_call-transaction]`)).toBeHidden();
      await page.waitForTimeout(1000);

      // token_transfer filter
      await page.click(`[data-test=token_transfer]`);
      await expect(page.locator(`[data-test=token_transfer-transaction]`)).toBeHidden();
      await page.waitForTimeout(1000);

      // coinbase filter
      await page.click(`[data-test=coinbase]`);
      await expect(page.locator(`[data-test=coinbase-transaction]`)).toBeHidden();
      await page.waitForTimeout(1000);
    });
  });
});
