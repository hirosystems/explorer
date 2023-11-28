import { isJSONString } from '../utils';

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
