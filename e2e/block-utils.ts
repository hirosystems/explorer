import { Page } from '@playwright/test';

export function hasBlocks(page: Page) {
  return page.waitForSelector('[data-test=block-0]');
}
