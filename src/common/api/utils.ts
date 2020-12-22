import { parseCookies, setCookie } from 'nookies';
import { NextPageContext } from 'next';
import { TransactionType } from '@blockstack/stacks-blockchain-api-types';
import {
  DEFAULT_NETWORK_INDEX,
  DEFAULT_NETWORK_LIST,
  NETWORK_CURRENT_INDEX_COOKIE,
  NETWORK_LIST_COOKIE,
} from '@common/constants';

export const getServerSideApiServer = async (ctx: NextPageContext) => {
  const cookies = parseCookies(ctx);
  const hasSet = cookies[NETWORK_LIST_COOKIE] || cookies[NETWORK_CURRENT_INDEX_COOKIE];

  const setDefaultIndexCookie = () => {
    setCookie(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(DEFAULT_NETWORK_INDEX), {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  };
  if (!hasSet) {
    if (!cookies[NETWORK_LIST_COOKIE]) {
      setCookie(ctx, NETWORK_LIST_COOKIE, JSON.stringify(DEFAULT_NETWORK_LIST), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
    }
    if (!cookies[NETWORK_CURRENT_INDEX_COOKIE]) {
      setDefaultIndexCookie();
    }

    return DEFAULT_NETWORK_LIST[DEFAULT_NETWORK_INDEX].url;
  }
  const index = JSON.parse(cookies[NETWORK_CURRENT_INDEX_COOKIE]);
  const list = JSON.parse(cookies[NETWORK_LIST_COOKIE]);
  const apiServer = list[index].url;
  if (apiServer.includes('localhost')) {
    try {
      await fetch(apiServer);
      return apiServer;
    } catch (e) {
      setDefaultIndexCookie();
      return list[DEFAULT_NETWORK_INDEX].url;
    }
  }

  return apiServer;
};

export const constructLimitAndOffsetQueryParams = (limit: number, offset?: number): string =>
  `limit=${limit}${offset ? `&offset=${offset}` : ''}`;

export const generateTypesQueryString = (types?: TransactionType[]) => {
  if (types?.length) {
    return `&${types
      .map(type => `${encodeURIComponent('type[]')}=${encodeURIComponent(type)}`)
      .join('&')}`;
  }
  return '';
};
