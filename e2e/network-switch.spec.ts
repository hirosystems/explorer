import { expect, test } from '@playwright/test';

// utility to fetch first block timestamp text
async function getFirstBlockTimestamp(page) {
  await page.waitForSelector('[aria-label^="Block timestamp"]');
  return page.locator('[aria-label^="Block timestamp"]').first().innerText();
}

test.describe('network switch', () => {
  test('block timestamps update on network change', async ({ page }) => {
    await page.goto('/');
    const mainnetTimestamp = await getFirstBlockTimestamp(page);

    await page.click('#settings-popover button');
    await page.click('text=Stacks Testnet (Primary)');

    const testnetTimestamp = await getFirstBlockTimestamp(page);
    expect(testnetTimestamp).not.toBe(mainnetTimestamp);
  });
});
