import fetch from 'isomorphic-unfetch';
import { withApiServer } from '@common/constants';

export const fetchFromApi = async (path: string, opts: object = {}) =>
  fetch(withApiServer(path), opts);

export const fetchFromSidecar = async (path: string, opts: object = {}) =>
  fetch(withApiServer('/sidecar/v1' + path), opts);

export const postToApi = async (path: string, opts: object = {}) =>
  fetchFromApi(path, { method: 'POST', ...opts });

export const postToSidecar = async (path: string, opts: object = {}) =>
  fetchFromSidecar(path, { method: 'POST', ...opts });
