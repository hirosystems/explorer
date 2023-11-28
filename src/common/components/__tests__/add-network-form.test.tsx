import { buildCustomNetworkUrl } from '../modals/AddNetwork/utils';

describe('buildCustomNetworkUrl', () => {
  const cases = [
    {
      description: 'builds URL',
      url: 'https://some-custom-url.com',
      expectedOutput: 'https://some-custom-url.com',
    },
    {
      description: 'builds URL with port',
      url: 'https://some-custom-url.com:1234',
      expectedOutput: 'https://some-custom-url.com:1234',
    },
    {
      description: 'builds URL for localhost',
      url: 'http://localhost:1234',
      expectedOutput: 'http://localhost:1234',
    },
    {
      description: 'builds URL with path',
      url: 'https://some-custom-url.com/some/path',
      expectedOutput: 'https://some-custom-url.com/some/path',
    },
  ];

  cases.forEach(({ description, url, expectedOutput }) => {
    it(description, () => {
      expect(buildCustomNetworkUrl(url)).toEqual(expectedOutput);
    });
  });
});
