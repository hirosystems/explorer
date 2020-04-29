import fetch from 'isomorphic-unfetch';
import { API_SERVER, API_SERVER_ENV } from '@common/constants';

export const fetchFromApi = async (path: string) => fetch(API_SERVER + path);
export const fetchFromRootApi = async (path: string) => fetch(API_SERVER_ENV + path);
