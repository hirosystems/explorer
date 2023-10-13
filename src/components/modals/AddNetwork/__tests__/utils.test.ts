import { validateUrl } from '../utils';

describe('validateUrl', () => {
  it('should return the missing error message if the URL is missing', async () => {
    const missingErrorMessage = 'URL is missing';
    const result = await validateUrl(missingErrorMessage, 'Invalid URL');
    expect(result).toEqual({
      isValid: false,
      message: missingErrorMessage,
    });
  });
  it('should return isValid as true if the URL is valid', async () => {
    const validUrl = 'https://www.example.com';
    const result = await validateUrl('URL is missing', 'Invalid URL', validUrl);
    expect(result).toEqual({
      isValid: true,
      message: '',
    });
  });
  it('should return the invalid error message if the URL is invalid', async () => {
    const invalidUrl = 'not-a-valid-url';
    const invalidErrorMessage = 'Invalid URL';
    const result = await validateUrl('URL is missing', invalidErrorMessage, invalidUrl);
    expect(result).toEqual({
      isValid: false,
      message: invalidErrorMessage,
    });
  });
});
