import { validateUrl } from '../validateUrl';

describe('validateUrl', () => {
  it('should return true if the url is valid', () => {
    expect(validateUrl('https://www.google.com')).toBe(true);
  });
  it('should return false if the url is invalid', () => {
    expect(validateUrl('INVALID_URL')).toBe(false);
  });
});
