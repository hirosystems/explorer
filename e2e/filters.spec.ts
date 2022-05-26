import { test, expect } from '@playwright/test';
import { GetTransactionListTypeEnum } from '@stacks/blockchain-api-client';
import { txs } from './mocks';

test.describe('Transaction page', () => {
  test.beforeEach(async ({ page, context }) => {
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
      await page.click(`[data-test=${GetTransactionListTypeEnum.smart_contract}]`);
      await expect(
        page.locator(`[data-test=${GetTransactionListTypeEnum.smart_contract}-transaction]`)
      ).toBeHidden();
      await page.waitForTimeout(1000);

      // contract_call filter
      await page.click(`[data-test=${GetTransactionListTypeEnum.contract_call}]`);
      await expect(
        page.locator(`[data-test=${GetTransactionListTypeEnum.contract_call}-transaction]`)
      ).toBeHidden();
      await page.waitForTimeout(1000);

      // token_transfer filter
      await page.click(`[data-test=${GetTransactionListTypeEnum.token_transfer}]`);
      await expect(
        page.locator(`[data-test=${GetTransactionListTypeEnum.token_transfer}-transaction]`)
      ).toBeHidden();
      await page.waitForTimeout(1000);

      // coinbase filter
      await page.click(`[data-test=${GetTransactionListTypeEnum.coinbase}]`);
      await expect(
        page.locator(`[data-test=${GetTransactionListTypeEnum.coinbase}-transaction]`)
      ).toBeHidden();
      await page.waitForTimeout(1000);
    });
  });
});
