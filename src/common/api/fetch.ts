import { withApiServer } from '@common/constants';

export const fetchFromApi = (apiServer: string) => async (path: string, opts: object = {}) =>
  fetch(withApiServer(apiServer)(path), opts);

export const fetchFromSidecar = (apiServer: string) => async (path: string, opts: object = {}) =>
  fetch(withApiServer(apiServer)('/extended/v1' + path), opts);

export const postToApi = (apiServer: string) => async (path: string, opts: object = {}) =>
  fetchFromApi(apiServer)(path, { method: 'POST', ...opts });

export const postToSidecar = (apiServer: string) => async (path: string, opts: object = {}) =>
  fetchFromSidecar(apiServer)(path, { method: 'POST', ...opts });
