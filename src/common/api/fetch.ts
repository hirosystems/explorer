import { HIRO_HEADERS, withApiServer } from '@common/constants';

export const fetchFromApi =
  (apiServer: string) =>
  async (path: string, opts = {}) => {
    return fetch(withApiServer(apiServer)(path), {
      ...opts,
      headers: HIRO_HEADERS,
    });
  };

export const fetchFromSidecar =
  (apiServer: string) =>
  async (path: string, opts = {}) => {
    return fetch(withApiServer(apiServer)('/extended/v1' + path), {
      ...opts,
      headers: HIRO_HEADERS,
    });
  };

export const postToApi =
  (apiServer: string) =>
  async (path: string, opts = {}) =>
    fetchFromApi(apiServer)(path, { method: 'POST', ...opts, headers: HIRO_HEADERS });

export const postToSidecar =
  (apiServer: string) =>
  async (path: string, opts = {}) =>
    fetchFromSidecar(apiServer)(path, { method: 'POST', ...opts, headers: HIRO_HEADERS });
