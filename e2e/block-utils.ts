export function hasBlocks(page) {
  return page.waitForSelector('[data-test=block-0]');
}
