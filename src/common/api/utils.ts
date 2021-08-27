import nookies from 'nookies';
import { NextPageContext } from 'next';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_NETWORK_INDEX,
  DEFAULT_NETWORK_LIST,
  DEFAULT_STATUS_ENDPOINT,
  DEFAULT_TESTNET_INDEX,
  DEFAULT_TESTNET_SERVER,
  NETWORK_CURRENT_INDEX_COOKIE,
  NETWORK_LIST_COOKIE,
} from '@common/constants';
import { fetchFromApi } from '@common/api/fetch';
import { NetworkModes } from '@common/types/network';

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
  const chain = ctx.query?.chain;

  const defaultApiServer = DEFAULT_NETWORK_LIST[DEFAULT_NETWORK_INDEX].url;
  // Set it to our default network
  let apiServer = defaultApiServer;
  // Get cookies
  const cookies = nookies.get(ctx);
  const savedNetworkIndex = cookies[NETWORK_CURRENT_INDEX_COOKIE];
  const INDEX = savedNetworkIndex && parseInt(savedNetworkIndex);

  let changed = false;

  // Check the query param 'chain' to set the api server and cookie
  if (chain) {
    if (chain === 'mainnet') {
      nookies.set(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(DEFAULT_NETWORK_INDEX), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
    } else if (chain === 'testnet') {
      apiServer = DEFAULT_NETWORK_LIST[DEFAULT_TESTNET_INDEX]?.url;
      nookies.set(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(DEFAULT_TESTNET_INDEX), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
    }
  } else {
    // If there is no chain, check if there is a saved network index to get the url
    // This will then set the networkMode and the chain downstream
    const savedServerUrl =
      typeof INDEX === 'number' ? DEFAULT_NETWORK_LIST[INDEX]?.url : defaultApiServer;
    apiServer = savedServerUrl;
  }

  try {
    // TODO: Confused bc this cookie doesn't seem to currently exist?
    // Should it be added in networkListState?
    const savedNetworkList = cookies[NETWORK_LIST_COOKIE];

    const savedIndexInt = savedNetworkIndex && parseInt(savedNetworkIndex);
    const hasSelectedIndex = typeof savedIndexInt === 'number';
    // TODO: I believer this will always be false?
    const hasCustomItems = !!savedNetworkList;

    // has saved list and has saved an index, and that index is greater than or equal to the
    // length of default list (meaning they are using a saved item as api server)
    if (
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
        const res = await fetchFromApi(apiServer)(DEFAULT_STATUS_ENDPOINT);
        await res.json();
      } catch (e) {
        // if it fails, reset to default
        apiServer = defaultApiServer;
      }
    }
    return apiServer;
  } catch (e) {
    return apiServer;
  }
};

export const constructLimitAndOffsetQueryParams = (limit: number, offset?: number): string =>
  `limit=${limit}${offset ? `&offset=${offset}` : ''}`;

export const generateTypesQueryString = (types?: Transaction['tx_type'][]) => {
  if (types?.length) {
    return `&${types
      .map(type => `${encodeURIComponent('type[]')}=${encodeURIComponent(type)}`)
      .join('&')}`;
  }
  return '';
};

export const getChainTypeFromUrl = (networkUrl: string | undefined) => {
  switch (networkUrl) {
    case DEFAULT_MAINNET_SERVER:
      return NetworkModes.Mainnet;
    case DEFAULT_TESTNET_SERVER:
      return NetworkModes.Testnet;
    default:
      return undefined;
  }
};
