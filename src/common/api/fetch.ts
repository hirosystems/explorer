import fetch from 'isomorphic-unfetch';
import { API_SERVER, API_SERVER_ENV } from '@common/constants';

export const fetchFromApi = async (path: string, opts: object = {}) =>
  fetch(API_SERVER + path, opts);

export const fetchFromRootApi = async (path: string, opts: object = {}) =>
  fetch(API_SERVER_ENV + path, opts);

export const postToRootApi = async (path: string, opts: object = {}) =>
  fetchFromRootApi(path, { method: 'POST', ...opts });
