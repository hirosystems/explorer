import { parseCookies } from 'nookies';
import getConfig from 'next/config';
import { NextPageContext } from 'next';
import { TransactionType } from '@blockstack/stacks-blockchain-api-types';

export const getServerSideApiServer = (ctx: NextPageContext) => {
  const cookies = parseCookies(ctx);
  const { publicRuntimeConfig } = getConfig();
  return cookies?.apiServer || publicRuntimeConfig.TESTNET_API_SERVER;
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
