import { Network } from '../../types/network';
import {
  advancedSearchConfig,
  buildAdvancedSearchQuery,
  parseAdvancedSearchQuery,
  useSearchPageUrl,
} from '../useSearchQuery';

const STX_ADDRESS_1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const STX_ADDRESS_2 = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';

describe('parseAdvancedSearchQuery', () => {
  test('should return an empty query if no advanced search terms are present', () => {
    const result = parseAdvancedSearchQuery('simple query');
    expect(result).toEqual([]);
  });

  test('should parse from: address correctly', () => {
    const result = parseAdvancedSearchQuery(`FROM:${STX_ADDRESS_1}`);
    expect(result).toEqual([{ filterName: 'fromAddress', filterValue: STX_ADDRESS_1 }]);
  });

  test('should parse to: address correctly', () => {
    const result = parseAdvancedSearchQuery(`TO:${STX_ADDRESS_2}`);
    expect(result).toEqual([{ filterName: 'toAddress', filterValue: STX_ADDRESS_2 }]);
  });

  test('should parse before: date correctly', () => {
    const result = parseAdvancedSearchQuery('BEFORE:2023-07-21');
    expect(result).toEqual([{ filterName: 'endTime', filterValue: 1689983999 }]);
  });

  test('should parse after: date correctly', () => {
    const result = parseAdvancedSearchQuery('AFTER:2023-07-21');
    expect(result).toEqual([{ filterName: 'startTime', filterValue: 1689897600 }]);
  });

  test('should parse multiple advanced search terms correctly', () => {
    const beforeDateInput = '2023-07-01';
    const afterDateInput = '2023-06-27';
    const beforeDateTimestamp = 1688255999;
    const afterDateTimestamp = 1687824000;
    const result = parseAdvancedSearchQuery(
      `FROM:${STX_ADDRESS_1} TO:${STX_ADDRESS_2}   BEFORE:${beforeDateInput}AFTER:${afterDateInput}`
    );
    expect(result).toEqual([
      { filterName: 'fromAddress', filterValue: STX_ADDRESS_1 },
      { filterName: 'toAddress', filterValue: STX_ADDRESS_2 },
      { filterName: 'endTime', filterValue: beforeDateTimestamp },
      { filterName: 'startTime', filterValue: afterDateTimestamp },
    ]);

    expect(advancedSearchConfig['BEFORE:'].build(beforeDateTimestamp)).toEqual(beforeDateInput);
    expect(advancedSearchConfig['AFTER:'].build(afterDateTimestamp)).toEqual(afterDateInput);
  });

  test('should ignore multiple spaces', () => {
    const result = parseAdvancedSearchQuery(`FROM:${STX_ADDRESS_1}       BEFORE:2022-07-01 `);
    expect(result).toEqual([
      { filterName: 'fromAddress', filterValue: STX_ADDRESS_1 },
      { filterName: 'endTime', filterValue: 1656719999 },
    ]);
  });
});

describe('buildAdvancedSearchQuery', () => {
  test('should build a query string from a parsed object', () => {
    const query = {
      fromAddress: STX_ADDRESS_1,
      toAddress: STX_ADDRESS_2,
      endTime: 1689983999,
      startTime: 1689897600,
    };
    const result = buildAdvancedSearchQuery(query);
    expect(result).toBe(
      `FROM:${STX_ADDRESS_1} TO:${STX_ADDRESS_2} BEFORE:2023-07-21 AFTER:2023-07-21`
    );
  });

  test('should build a query string with partial query object', () => {
    const query = {
      fromAddress: STX_ADDRESS_1,
      toAddress: null,
    };
    const result = buildAdvancedSearchQuery(query);
    expect(result).toBe(`FROM:${STX_ADDRESS_1}`);
  });

  test('should handle empty query object correctly', () => {
    const query = {};
    const result = buildAdvancedSearchQuery(query);
    expect(result).toBe('');
  });

  test('should transform and then build to match original value', () => {
    const originalDate = '2023-07-21';
    const transformedDate = advancedSearchConfig['BEFORE:'].transform(originalDate);
    const rebuiltDate = advancedSearchConfig['BEFORE:'].build(transformedDate);
    expect(rebuiltDate).toEqual(originalDate);

    const originalDate2 = '2023-07-21';
    const transformedDate2 = advancedSearchConfig['AFTER:'].transform(originalDate2);
    const rebuiltDate2 = advancedSearchConfig['AFTER:'].build(transformedDate2);
    expect(rebuiltDate2).toEqual(originalDate2);
  });
});

describe('getSearchPageUrl', () => {
  test('should return a URL with a single advanced search parameter', () => {
    const result = useSearchPageUrl(`FROM:${STX_ADDRESS_1}`, {} as Network);
    expect(result).toBe(`/search?chain=mainnet&fromAddress=${encodeURIComponent(STX_ADDRESS_1)}`);
  });

  test('should return a URL with multiple advanced search parameters', () => {
    const searchTerm = `FROM:${STX_ADDRESS_1} TO:${STX_ADDRESS_2} BEFORE:2023-07-21`;
    const result = useSearchPageUrl(searchTerm, {} as Network);
    expect(result).toBe(
      `/search?chain=mainnet&fromAddress=${encodeURIComponent(
        STX_ADDRESS_1
      )}&toAddress=${encodeURIComponent(STX_ADDRESS_2)}&endTime=1689983999`
    );
  });

  test('should correctly handle an empty search term', () => {
    const result = useSearchPageUrl('', {} as Network);
    expect(result).toBe('/search?chain=mainnet');
  });

  test('should ignore spaces between advanced search terms', () => {
    const searchTerm = `FROM:${STX_ADDRESS_1}   TO:${STX_ADDRESS_2}   BEFORE:2023-07-21 `;
    const result = useSearchPageUrl(searchTerm, {} as Network);
    expect(result).toBe(
      `/search?chain=mainnet&fromAddress=${encodeURIComponent(
        STX_ADDRESS_1
      )}&toAddress=${encodeURIComponent(STX_ADDRESS_2)}&endTime=1689983999`
    );
  });
});
