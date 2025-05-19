import { getBlockListQueryKey } from '../useBlockListInfinite';

describe('getBlockListQueryKey', () => {
  it('constructs a key with network identifier', () => {
    const key = getBlockListQueryKey(10, 'testnet');
    expect(key).toEqual(['blockListInfinite', 10, 'testnet']);
  });
});
