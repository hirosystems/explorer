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
    {
      description: 'builds URL with path',
      url: 'http://umbrel.local:3999',
      expectedOutput: 'http://umbrel.local:3999',
    },
    {
      description: 'builds URL with path',
      url: 'ftp://umbrel.local:3999',
      expectedOutput: 'https://umbrel.local:3999',
    },
  ];

  cases.forEach(({ description, url, expectedOutput }) => {
    it(description, () => {
      expect(buildCustomNetworkUrl(url)).toEqual(expectedOutput);
    });
  });
});
