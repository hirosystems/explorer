import { expect, test } from '@playwright/test';
import { addresses, emptyAddresses } from './addresses-test-vector';

async function hasTransactions(page) {
  await expect(page.locator('[data-test=account-transaction-list]')).toHaveCount(1);
}

async function hasNoTransactions(page) {
  await expect(page.locator('[data-test=account-transaction-list]')).toHaveCount(0);
}

test.describe('/address page', () => {
  test.describe('Loads the address pages (non empty addresses)', () => {
    Object.keys(addresses).forEach(network => {
      Object.keys(addresses[network]).forEach(type => {
        addresses[network][type].forEach(address => {
          test(`transactions type ${type} with address=${address} on network=${network}`, async ({
            page,
          }) => {
            await page.goto(`/address/${address}?chain=${network}`);
            await expect(page.locator('[data-test=address-title]')).toBeTruthy();
            await hasTransactions(page);
          });
        });
      });
    });
  });

  test.describe('Loads the address pages (empty addresses)', () => {
    Object.keys(emptyAddresses).forEach(network => {
      Object.keys(emptyAddresses[network]).forEach(type => {
        emptyAddresses[network][type].forEach(address => {
          test(`transactions type ${type} with address=${address} on network=${network}`, async ({
            page,
          }) => {
            await page.goto(`/address/${address}?chain=${network}`);
            await expect(page.locator('[data-test=address-title]')).toBeTruthy();
            await page.waitForSelector('[data-test=account-transaction-list]');
            await hasNoTransactions(page);
          });
        });
      });
    });
  });
});
