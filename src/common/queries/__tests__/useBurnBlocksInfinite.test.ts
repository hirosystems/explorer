import { getBurnBlocksQueryKey } from '../useBurnBlocksInfinite';

describe('getBurnBlocksQueryKey', () => {
  it('includes network identifier', () => {
    const key = getBurnBlocksQueryKey(5, 'https://api.hiro.so');
    expect(key).toEqual(['burnBlocks', 5, 'https://api.hiro.so']);
  });

  it('handles query key extension', () => {
    const key = getBurnBlocksQueryKey(3, 'net', 'extra');
    expect(key).toEqual(['burnBlocks', 3, 'net', 'extra']);
  });
});
