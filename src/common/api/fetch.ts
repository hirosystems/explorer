import { HIRO_HEADERS, withApiServer } from '@/common/constants';

export const fetcher = async (input: RequestInfo, init: RequestInit = {}) => {
  const initHeaders = init.headers || {};
  try {
    return await fetch(input, {
      credentials: 'omit',
      ...init,
      headers: { ...initHeaders, ...HIRO_HEADERS },
    });
  } catch (error) {
    throw new Error(`Network error: ${error.message}`);
  }
};

export const fetchFromApi =
  (apiServer: string) =>
  async (path: string, opts = {}) => {
    return fetcher(withApiServer(apiServer)(path), {
      ...opts,
    });
  };
