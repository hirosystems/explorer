import fetch from 'isomorphic-unfetch';
import { API_SERVER } from '@common/constants';

export const fetchFromApi = async (path: string) => fetch(API_SERVER + path);
