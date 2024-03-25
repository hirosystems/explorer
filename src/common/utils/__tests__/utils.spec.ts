import { isJSONString, removeTrailingSlash } from '../utils';

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
