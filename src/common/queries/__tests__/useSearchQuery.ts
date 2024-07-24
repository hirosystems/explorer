import { formatTimestamp, parseAdvancedSearchQuery } from '../useSearchQuery';

const STX_ADDRESS_1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const STX_ADDRESS_2 = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';

describe('parseAdvancedSearchQuery', () => {
  test('should return an empty query if no advanced search terms are present', () => {
    const result = parseAdvancedSearchQuery('simple query');
    expect(result).toEqual({});
  });

  test('should parse from: address correctly', () => {
    const result = parseAdvancedSearchQuery(`FROM:${STX_ADDRESS_1}`);
    expect(result).toEqual({ fromAddress: STX_ADDRESS_1 });
  });

  test('should parse to: address correctly', () => {
    const result = parseAdvancedSearchQuery(`TO:${STX_ADDRESS_2}`);
    expect(result).toEqual({ toAddress: STX_ADDRESS_2 });
  });

  test('should parse before: date correctly', () => {
    const result = parseAdvancedSearchQuery('BEFORE:2023-07-21');
    expect(result).toEqual({ endTime: 1689983999 });
  });

  test('should parse after: date correctly', () => {
    const result = parseAdvancedSearchQuery('AFTER:2023-07-21');
    expect(result).toEqual({ startTime: 1689897600 });
  });

  test('should parse multiple advanced search terms correctly', () => {
    const beforeDateInput = '2023-07-01';
    const afterDateInput = '2023-06-27';
    const beforeDateTimestamp = 1688255999;
    const afterDateTimestamp = 1687824000;
    const result = parseAdvancedSearchQuery(
      `FROM:${STX_ADDRESS_1} TO:${STX_ADDRESS_2}   BEFORE:${beforeDateInput}AFTER:${afterDateInput}`
    );
    expect(result).toEqual({
      fromAddress: STX_ADDRESS_1,
      toAddress: STX_ADDRESS_2,
      endTime: beforeDateTimestamp,
      startTime: afterDateTimestamp,
    });

    expect(formatTimestamp(beforeDateTimestamp.toString())).toEqual(beforeDateInput);
    expect(formatTimestamp(afterDateTimestamp.toString())).toEqual(afterDateInput);
  });

  test('should ignore multiple spaces', () => {
    const result = parseAdvancedSearchQuery(`FROM:${STX_ADDRESS_1}       BEFORE:2022-07-01 `);
    expect(result).toEqual({
      fromAddress: STX_ADDRESS_1,
      endTime: 1656719999,
    });
  });
});
