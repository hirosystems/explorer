import { getBlocksByBurnBlockQueryKey } from '../useBlocksByBurnBlock';

describe('getBlocksByBurnBlockQueryKey', () => {
  it('constructs a key with network identifier', () => {
    const key = getBlocksByBurnBlockQueryKey('123', 'net', 'range', 'ext');
    expect(key).toEqual(['getBlocksByBurnBlock', '123', 'net', 'range', 'ext']);
  });
});
