import nookies from 'nookies';
import { NextPageContext } from 'next';
import { TransactionType } from '@blockstack/stacks-blockchain-api-types';
import {
  DEFAULT_NETWORK_INDEX,
  DEFAULT_NETWORK_LIST,
  NETWORK_CURRENT_INDEX_COOKIE,
  NETWORK_LIST_COOKIE,
} from '@common/constants';
import { fetchFromApi } from '@common/api/fetch';

export const getServerSideApiServer = async (ctx: NextPageContext) => {
  const defaultApiServer = DEFAULT_NETWORK_LIST[DEFAULT_NETWORK_INDEX].url;
  const backupApiServer = DEFAULT_NETWORK_LIST[1].url;
  let apiServer = defaultApiServer;
  let changed = false;
  try {
    const cookies = nookies.get(ctx);
    const index = cookies[NETWORK_CURRENT_INDEX_COOKIE];
    const list = cookies[NETWORK_LIST_COOKIE];

    const hasCustomItems = !!list;
    const hasSelectedIndex = !!index;

    if (hasSelectedIndex && parseInt(index) < 3) {
      const INDEX = JSON.parse(index);
      if (INDEX !== DEFAULT_NETWORK_INDEX) {
        apiServer = DEFAULT_NETWORK_LIST[INDEX].url;
        changed = true;
      }
    } else if (hasSelectedIndex && hasCustomItems && parseInt(index) >= 3) {
      const NETWORK_LIST = JSON.parse(list);
      const INDEX = JSON.parse(index);
      const customServer = NETWORK_LIST[INDEX - 3]?.url;
      if (customServer) {
        apiServer = customServer;
        changed = true;
      }
    }
    if (changed && apiServer) {
      try {
        const res = await fetchFromApi(apiServer)('/v2/info');
        const data = await res.json();
      } catch (e) {
        apiServer = defaultApiServer;
      }
    } else {
      // backup
      try {
        if (apiServer) {
          const res = await fetchFromApi(apiServer)('/v2/info');
          const data = await res.json();
        }
      } catch (e) {
        apiServer = backupApiServer;
        nookies.set(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(1), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      }
    }

    return apiServer as string;
  } catch (e) {
    return apiServer as string;
  }
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
