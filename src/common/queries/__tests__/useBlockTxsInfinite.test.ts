import { getBlockTxsQueryKey } from '../useBlockTxsInfinite';

describe('getBlockTxsQueryKey', () => {
  test('returns a network aware query key', () => {
    expect(getBlockTxsQueryKey('hash', 'net')).toEqual(['blockTxsInfinite', 'hash', 'net']);
  });
});
