'use client';

import { withApiServer } from '../constants/constants';
import { HIRO_HEADERS } from '../constants/env';

export const fetcher = (input: RequestInfo, init: RequestInit = {}) => {
  const initHeaders = init.headers || {};
  return fetch(input, {
    credentials: 'omit',
    ...init,
    headers: { ...initHeaders, ...HIRO_HEADERS },
  });
};

export const fetchFromApi =
  (apiServer: string) =>
  async (path: string, opts = {}) => {
    return fetcher(withApiServer(apiServer)(path), {
      ...opts,
    });
  };
