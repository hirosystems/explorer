import nookies from 'nookies';
import { NextPageContext } from 'next';
import { TransactionType } from '@blockstack/stacks-blockchain-api-types';
import {
  DEFAULT_NETWORK_INDEX,
  DEFAULT_NETWORK_LIST,
  DEFAULT_TESTNET_INDEX,
  NETWORK_CURRENT_INDEX_COOKIE,
  NETWORK_LIST_COOKIE,
} from '@common/constants';
import { fetchFromApi } from '@common/api/fetch';

/**
 * Get the api server in SSR contexts
 *
 * This function will check cookies to see if a user has:
 * a) selected a different index other than the default
 * b) a + has defined a custom network
 * c) use default server defined
 *
 * Additionally, the function will check and make sure the api server selected
 * is functioning, and if it is not, it will switch to whichever default
 * is online (mainnet/testnet)
 */
export const getServerSideApiServer = async (ctx: NextPageContext) => {
  const defaultApiServer = DEFAULT_NETWORK_LIST[DEFAULT_NETWORK_INDEX].url;
  const backupApiServer = DEFAULT_NETWORK_LIST[1].url;
  // set it to our default network
  let apiServer = defaultApiServer;
  let changed = false;

  try {
    // check for cookies
    const cookies = nookies.get(ctx);
    const savedNetworkIndex = cookies[NETWORK_CURRENT_INDEX_COOKIE];
    const savedNetworkList = cookies[NETWORK_LIST_COOKIE];

    const savedIndexInt = savedNetworkIndex && parseInt(savedNetworkIndex);
    const hasSelectedIndex = typeof savedIndexInt === 'number';

    const hasCustomItems = !!savedNetworkList;

    // if there is a saved index, and it's less than the length of the built in list
    // meaning the user has saved one of the built in items, so pull from default list
    if (hasSelectedIndex && savedIndexInt && savedIndexInt < DEFAULT_NETWORK_LIST.length) {
      const INDEX = savedIndexInt;
      apiServer = DEFAULT_NETWORK_LIST[INDEX].url;
      changed = true;
    }
    // has saved list and has saved an index, and that index is greater than or equal to the
    // length of default list (meaning they are using a saved item as api server)
    else if (
      hasSelectedIndex &&
      hasCustomItems &&
      savedIndexInt &&
      savedIndexInt >= DEFAULT_NETWORK_LIST.length
    ) {
      const NETWORK_LIST = JSON.parse(savedNetworkList);
      const INDEX = savedIndexInt;
      const customServer = NETWORK_LIST[INDEX - DEFAULT_NETWORK_LIST.length]?.url;
      if (customServer) {
        apiServer = customServer;
        changed = true;
      }
    }
    // check the server works
    if (changed && apiServer) {
      try {
        const res = await fetchFromApi(apiServer)('/v2/info');
        const data = await res.json();
      } catch (e) {
        // if it fails, reset to default
        apiServer = defaultApiServer;
      }
    } else {
      // if not changed, try it
      try {
        if (apiServer) {
          const res = await fetchFromApi(apiServer)('/v2/info');
          const data = await res.json();
        }
      } catch (e) {
        // if it fails, change it to backup
        // todo: eventually set a second cookie to show a toast for this behavior
        apiServer = backupApiServer;
        nookies.set(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(DEFAULT_TESTNET_INDEX), {
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
