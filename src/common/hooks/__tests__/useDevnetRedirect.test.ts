import { renderHook } from '@testing-library/react';
import { ReadonlyURLSearchParams } from 'next/navigation';

import { useDevnetRedirect } from '../useDevnetRedirect';

jest.mock('../../constants/env', () => ({
  DEVNET_PORT: '8000',
  DEVNET_SERVER: 'http://localhost:3999',
}));

jest.mock('../../utils/network-utils', () => ({
  isLocalhost: jest.fn(),
}));

const mockIsLocalhost = jest.requireMock('../../utils/network-utils').isLocalhost;

const mockWindowLocationReplace = jest.fn();

Object.defineProperty(global, 'window', {
  value: {
    location: {
      hostname: 'localhost',
      port: '8000',
      search: '',
      replace: mockWindowLocationReplace,
    },
  },
  writable: true,
});

const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params);
  return searchParams as ReadonlyURLSearchParams;
};

describe('useDevnetRedirect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLocalhost.mockReturnValue(false);

    Object.defineProperty(global, 'window', {
      value: {
        location: {
          hostname: 'localhost',
          port: '8000',
          search: '',
          replace: mockWindowLocationReplace,
        },
      },
      writable: true,
    });
  });

  describe('bare localhost redirect', () => {
    it('should redirect bare localhost:8000 to full devnet configuration', () => {
      const searchParams = createMockSearchParams();
      const pathname = '/';

      renderHook(() =>
        useDevnetRedirect({
          api: null,
          ssr: null,
          searchParams,
          pathname,
        })
      );

      expect(mockWindowLocationReplace).toHaveBeenCalledWith(
        '/?chain=testnet&api=http%3A%2F%2Flocalhost%3A3999&ssr=false'
      );
    });

    it('should redirect bare localhost:8000 with pathname to full devnet configuration', () => {
      const searchParams = createMockSearchParams();
      const pathname = '/blocks';

      renderHook(() =>
        useDevnetRedirect({
          api: null,
          ssr: null,
          searchParams,
          pathname,
        })
      );

      expect(mockWindowLocationReplace).toHaveBeenCalledWith(
        '/blocks?chain=testnet&api=http%3A%2F%2Flocalhost%3A3999&ssr=false'
      );
    });

    it('should not redirect if hostname is not localhost', () => {
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            hostname: 'example.com',
            port: '8000',
            search: '',
            replace: mockWindowLocationReplace,
          },
        },
        writable: true,
      });

      const searchParams = createMockSearchParams();
      const pathname = '/';

      renderHook(() =>
        useDevnetRedirect({
          api: null,
          ssr: null,
          searchParams,
          pathname,
        })
      );

      expect(mockWindowLocationReplace).not.toHaveBeenCalled();
    });

    it('should not redirect if port is not 8000', () => {
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            hostname: 'localhost',
            port: '3000',
            search: '',
            replace: mockWindowLocationReplace,
          },
        },
        writable: true,
      });

      const searchParams = createMockSearchParams();
      const pathname = '/';

      renderHook(() =>
        useDevnetRedirect({
          api: null,
          ssr: null,
          searchParams,
          pathname,
        })
      );

      expect(mockWindowLocationReplace).not.toHaveBeenCalled();
    });

    it('should not redirect if there are existing query parameters', () => {
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            hostname: 'localhost',
            port: '8000',
            search: '?chain=mainnet',
            replace: mockWindowLocationReplace,
          },
        },
        writable: true,
      });

      const searchParams = createMockSearchParams({ chain: 'mainnet' });
      const pathname = '/';

      renderHook(() =>
        useDevnetRedirect({
          api: 'https://api.mainnet.stacks.co',
          ssr: null,
          searchParams,
          pathname,
        })
      );

      expect(mockWindowLocationReplace).not.toHaveBeenCalled();
    });
  });

  describe('SSR parameter addition', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            hostname: 'example.com',
            port: '3000',
            search: '?api=http://localhost:3999',
            replace: mockWindowLocationReplace,
          },
        },
        writable: true,
      });
    });

    it('should add ssr=false when api points to localhost and ssr is missing', () => {
      mockIsLocalhost.mockReturnValue(true);

      const searchParams = createMockSearchParams({
        api: 'http://localhost:3999',
        chain: 'testnet',
      });
      const pathname = '/';

      renderHook(() =>
        useDevnetRedirect({
          api: 'http://localhost:3999',
          ssr: null,
          searchParams,
          pathname,
        })
      );

      expect(mockIsLocalhost).toHaveBeenCalledWith('http://localhost:3999');
      expect(mockWindowLocationReplace).toHaveBeenCalledWith(
        '/?api=http%3A%2F%2Flocalhost%3A3999&chain=testnet&ssr=false'
      );
    });

    it('should not add ssr=false when ssr parameter already exists', () => {
      mockIsLocalhost.mockReturnValue(true);

      const searchParams = createMockSearchParams({
        api: 'http://localhost:3999',
        chain: 'testnet',
        ssr: 'true',
      });
      const pathname = '/';

      renderHook(() =>
        useDevnetRedirect({
          api: 'http://localhost:3999',
          ssr: 'true',
          searchParams,
          pathname,
        })
      );

      expect(mockWindowLocationReplace).not.toHaveBeenCalled();
    });

    it('should not add ssr=false when api does not point to localhost', () => {
      mockIsLocalhost.mockReturnValue(false);

      const searchParams = createMockSearchParams({
        api: 'https://api.mainnet.stacks.co',
        chain: 'mainnet',
      });
      const pathname = '/';

      renderHook(() =>
        useDevnetRedirect({
          api: 'https://api.mainnet.stacks.co',
          ssr: null,
          searchParams,
          pathname,
        })
      );

      expect(mockIsLocalhost).toHaveBeenCalledWith('https://api.mainnet.stacks.co');
      expect(mockWindowLocationReplace).not.toHaveBeenCalled();
    });

    it('should not add ssr=false when api parameter is missing', () => {
      const searchParams = createMockSearchParams({
        chain: 'testnet',
      });
      const pathname = '/';

      renderHook(() =>
        useDevnetRedirect({
          api: null,
          ssr: null,
          searchParams,
          pathname,
        })
      );

      expect(mockWindowLocationReplace).not.toHaveBeenCalled();
    });
  });
});
