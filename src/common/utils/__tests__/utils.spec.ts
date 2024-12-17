import { abbreviateNumber, isJSONString, removeTrailingSlash } from '../utils';

describe('isJSONString', () => {
  test('returns true for a valid JSON string', () => {
    const jsonString = '{"key": "value"}';
    expect(isJSONString(jsonString)).toBe(true);
  });

  test('returns false for an invalid JSON string', () => {
    const invalidJsonString = '{"key": "value}';
    expect(isJSONString(invalidJsonString)).toBe(false);
  });

  test('returns false for a non-string input', () => {
    const nonStringInput = { key: 'value' };
    expect(isJSONString(nonStringInput as any)).toBe(false);
  });

  test('returns false for an empty string', () => {
    const emptyString = '';
    expect(isJSONString(emptyString)).toBe(false);
  });

  test('returns false for non-JSON strings', () => {
    const nonJsonString = 'Hello, World!';
    expect(isJSONString(nonJsonString)).toBe(false);
  });
});

describe('removeTrailingSlash', () => {
  test('removes trailing slash from a string', () => {
    const url = 'https://example.com/';
    expect(removeTrailingSlash(url)).toBe('https://example.com');
  });

  test('returns original string if there is no trailing slash', () => {
    const url = 'https://example.com';
    expect(removeTrailingSlash(url)).toBe('https://example.com');
  });

  test('handles undefined', () => {
    expect(removeTrailingSlash(undefined)).toBe('');
  });
});

describe('abbreviateNumber', () => {
  // Test regular numbers (no abbreviation needed)
  test('handles regular numbers', () => {
    expect(abbreviateNumber(0)).toBe('0');
    expect(abbreviateNumber(1)).toBe('1');
    expect(abbreviateNumber(999)).toBe('999');
    expect(abbreviateNumber(1000)).toBe('1,000');
    expect(abbreviateNumber(9999)).toBe('9,999');
    expect(abbreviateNumber(99999)).toBe('99,999');
    expect(abbreviateNumber(999999)).toBe('999,999');
  });

  // // Test millions
  test('handles millions correctly', () => {
    expect(abbreviateNumber(1000000)).toBe('1M');
    expect(abbreviateNumber(1100000)).toBe('1.1M');
    expect(abbreviateNumber(1110000)).toBe('1.11M');
    expect(abbreviateNumber(1111000)).toBe('1.11M');
    expect(abbreviateNumber(9900000)).toBe('9.9M');
    expect(abbreviateNumber(99900000)).toBe('99.9M');
    expect(abbreviateNumber(999900000)).toBe('999.9M');
  });

  // // Test billions
  test('handles billions correctly', () => {
    expect(abbreviateNumber(1000000000)).toBe('1B');
    expect(abbreviateNumber(1100000000)).toBe('1.1B');
    expect(abbreviateNumber(1110000000)).toBe('1.11B');
    expect(abbreviateNumber(9900000000)).toBe('9.9B');
    expect(abbreviateNumber(99900000000)).toBe('99.9B');
    expect(abbreviateNumber(999900000000)).toBe('999.9B');
  });

  // // Test trillions
  test('handles trillions correctly', () => {
    expect(abbreviateNumber(1000000000000)).toBe('1T');
    expect(abbreviateNumber(1100000000000)).toBe('1.1T');
    expect(abbreviateNumber(1110000000000)).toBe('1.11T');
    expect(abbreviateNumber(9900000000000)).toBe('9.9T');
  });

  // Test decimal numbers
  test('handles decimal numbers correctly', () => {
    expect(abbreviateNumber(1.23)).toBe('1.23');
    expect(abbreviateNumber(1.2345)).toBe('1.2345');
    expect(abbreviateNumber(1000.23)).toBe('1,000.23');
    expect(abbreviateNumber(1000000.23)).toBe('1M');
  });

  // Test small numbers
  test('handles small numbers correctly', () => {
    expect(abbreviateNumber(0.1)).toBe('0.1');
    expect(abbreviateNumber(0.01)).toBe('0.01');
    expect(abbreviateNumber(0.001)).toBe('0.001');
    expect(abbreviateNumber(0.0001)).toBe('0.0001');
  });

  // Test edge cases
  test('handles edge cases correctly', () => {
    expect(abbreviateNumber(999999999)).toBe('1,000M'); // TODO: fix. This should round up to 1B
    expect(abbreviateNumber(999499999)).toBe('999.5M'); // Should stay in millions
    expect(abbreviateNumber(1000000000000000)).toBe('1Q'); // Quadrillion
    expect(abbreviateNumber(0)).toBe('0');
  });

  // test('handles negative numbers correctly', () => {
  //   expect(abbreviateNumber(-1000000)).toBe('-1M'); // TODO: fix. This should be -1M
  //   expect(abbreviateNumber(-1000000000)).toBe('-1B'); // TODO: fix. This should be -1B
  // });

  // Test with specific decimal places
  // test('handles custom decimal places correctly', () => {
  //   expect(abbreviateNumber(1234567, 3)).toBe('1.235M'); // TODO: fix. We should be able to pass in a decimal argument that does something when the number is >= 1M
  //   expect(abbreviateNumber(1234567, 1)).toBe('1.23M');
  //   expect(abbreviateNumber(1234567, 0)).toBe('1M');
  //   expect(abbreviateNumber(1234.5678, 2)).toBe('1,234.57');
  // });

  // Test number formatting
  test('formats numbers with correct separators', () => {
    expect(abbreviateNumber(1234567890)).toBe('1.23B');
    expect(abbreviateNumber(1234567)).toBe('1.23M');
    expect(abbreviateNumber(12345)).toBe('12,345');
  });

  // Test trailing zeros
  test('handles trailing zeros correctly', () => {
    expect(abbreviateNumber(1000000.0)).toBe('1M');
    expect(abbreviateNumber(1100000.0)).toBe('1.1M');
    expect(abbreviateNumber(1.0)).toBe('1');
    expect(abbreviateNumber(1.1)).toBe('1.1');
  });

  test('For small decimal numbers, it shows the full number when there is no decimal argument', () => {
    expect(abbreviateNumber(1.345345)).toBe('1.345345');
    expect(abbreviateNumber(0.000234534)).toBe('0.000234534');
  });

  test('For small decimal numbers, it shows the correct number of decimal places based on the decimal argument', () => {
    expect(abbreviateNumber(1.345345, 2)).toBe('1.35');
    expect(abbreviateNumber(1.345345, 3)).toBe('1.345');
    expect(abbreviateNumber(1.345345, 4)).toBe('1.3453');

    expect(abbreviateNumber(0.000234534, 2)).toBe('0.00023');
    expect(abbreviateNumber(0.000234534, 3)).toBe('0.000235');
    expect(abbreviateNumber(0.000234534, 4)).toBe('0.0002');
  });
});
