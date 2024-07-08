import { parseAdvancedSearchQuery } from '../useSearchQuery';

const STX_ADDRESS_1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const STX_ADDRESS_2 = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';

describe('parseAdvancedSearchQuery', () => {
  test('should return an empty query if no advanced search terms are present', () => {
    const result = parseAdvancedSearchQuery('simple query');
    expect(result).toEqual({});
  });

  test('should parse from: address correctly', () => {
    const result = parseAdvancedSearchQuery(`from:${STX_ADDRESS_1}`);
    expect(result).toEqual({ fromAddress: STX_ADDRESS_1 });
  });

  test('should parse to: address correctly', () => {
    const result = parseAdvancedSearchQuery(`to:${STX_ADDRESS_2}`);
    expect(result).toEqual({ toAddress: STX_ADDRESS_2 });
  });

  test('should parse before: date correctly', () => {
    const result = parseAdvancedSearchQuery('before:2023-07-01');
    expect(result).toEqual({ endTime: 1688169600 });
  });

  test('should parse after: date correctly', () => {
    const result = parseAdvancedSearchQuery('after:2023-06-01');
    expect(result).toEqual({ startTime: 1685577600 });
  });

  test('should ignore invalid from: address', () => {
    const result = parseAdvancedSearchQuery('from:invalidAddress');
    expect(result).toEqual({});
  });

  test('should ignore invalid to: address', () => {
    const result = parseAdvancedSearchQuery('to:invalidAddress');
    expect(result).toEqual({});
  });

  test('should ignore invalid before: date', () => {
    const result = parseAdvancedSearchQuery('before:invalid-date');
    expect(result).toEqual({});
  });

  test('should ignore invalid after: date', () => {
    const result = parseAdvancedSearchQuery('after:invalid-date');
    expect(result).toEqual({});
  });

  test('should parse multiple advanced search terms correctly', () => {
    const result = parseAdvancedSearchQuery(
      `from:${STX_ADDRESS_1} to:${STX_ADDRESS_2} before:2023-07-01 after:2023-06-01`
    );
    expect(result).toEqual({
      fromAddress: STX_ADDRESS_1,
      toAddress: STX_ADDRESS_2,
      endTime: 1688169600,
      startTime: 1685577600,
    });
  });

  test('should ignore multiple spaces and invalid terms', () => {
    const result = parseAdvancedSearchQuery(
      `from:${STX_ADDRESS_1}    to:invalidAddress before:2023-07-01 after:invalid-date`
    );
    expect(result).toEqual({
      fromAddress: STX_ADDRESS_1,
      endTime: 1688169600,
    });
  });
});
