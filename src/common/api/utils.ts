import { parseCookies, setCookie } from 'nookies';
import getConfig from 'next/config';
import { NextPageContext } from 'next';
import { TransactionType } from '@blockstack/stacks-blockchain-api-types';

export const getServerSideApiServer = (ctx: NextPageContext) => {
  const cookies = parseCookies(ctx);
  const { publicRuntimeConfig } = getConfig();
  if (!cookies.apiServer) {
    const defaultValue = publicRuntimeConfig.TESTNET_API_SERVER;
    setCookie(ctx, 'apiServer', publicRuntimeConfig.TESTNET_API_SERVER as string, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    return defaultValue;
  }
  return cookies?.apiServer;
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
