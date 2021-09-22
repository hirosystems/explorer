import nookies from 'nookies';
import { NextPageContext } from 'next';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import {
  DEFAULT_MAINNET_INDEX,
  DEFAULT_NETWORK_LIST,
  DEFAULT_TESTNET_INDEX,
  NETWORK_CURRENT_INDEX_COOKIE,
  NETWORK_CUSTOM_LIST_COOKIE,
  DEFAULT_V2_INFO_ENDPOINT,
} from '@common/constants';
import { fetchFromApi } from '@common/api/fetch';
import { NetworkModes } from '@common/types/network';
import { ChainID } from '@stacks/transactions';

export const getSavedNetworkIndex = (ctx: NextPageContext) => {
  const cookies = nookies.get(ctx);
  const savedNetworkIndex = cookies[NETWORK_CURRENT_INDEX_COOKIE];
  const parsedIndex = savedNetworkIndex ? parseInt(savedNetworkIndex) : 0;
  return parsedIndex;
};

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
  const defaultApiServer = DEFAULT_NETWORK_LIST[DEFAULT_MAINNET_INDEX].url;
  // Set it to our default network
  let apiServer = defaultApiServer;
  const INDEX = getSavedNetworkIndex(ctx);

  // This code block handles default networks
  // Check the query param 'chain' to set the api server and cookie
  if (INDEX === DEFAULT_MAINNET_INDEX || INDEX === DEFAULT_TESTNET_INDEX) {
    if (chain) {
      if (chain === NetworkModes.Mainnet) {
        nookies.set(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(DEFAULT_MAINNET_INDEX), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      } else if (chain === NetworkModes.Testnet) {
        apiServer = DEFAULT_NETWORK_LIST[DEFAULT_TESTNET_INDEX]?.url;
        nookies.set(ctx, NETWORK_CURRENT_INDEX_COOKIE, JSON.stringify(DEFAULT_TESTNET_INDEX), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      }
    } else {
      // If there is no chain, check if there is a saved network index to get the server
      const savedServerUrl =
        typeof INDEX === 'number' ? DEFAULT_NETWORK_LIST[INDEX]?.url : defaultApiServer;
      apiServer = savedServerUrl;
    }
    return apiServer;
  } else {
    // This code block handles custom networks and attempts to test the server
    try {
      const cookies = nookies.get(ctx);
      const savedCustomNetworkList = cookies[NETWORK_CUSTOM_LIST_COOKIE];
      const hasValidIndex = INDEX && typeof INDEX === 'number';
      const hasCustomItems = !!savedCustomNetworkList;

      // Has a saved custom network list and the saved index is one of those networks
      if (hasValidIndex && hasCustomItems && INDEX >= DEFAULT_NETWORK_LIST.length) {
        const NETWORK_LIST = JSON.parse(savedCustomNetworkList);
        const customServer = NETWORK_LIST[INDEX - DEFAULT_NETWORK_LIST.length]?.url;

        if (customServer) {
          // Check to make sure the server works and use the network id
          try {
            const response = await fetchFromApi(customServer)(DEFAULT_V2_INFO_ENDPOINT);
            const data = await response.json();
            // Network id of the custom network
            const customServerNetworkId: ChainID.Mainnet | ChainID.Testnet =
              data?.network_id && parseInt(data?.network_id);
            const chainIsTestnet = chain === NetworkModes.Testnet;
            // Network id of the chain query param
            const chainNetworkId: ChainID.Mainnet | ChainID.Testnet = chainIsTestnet
              ? ChainID.Testnet
              : ChainID.Mainnet;
            // If they are the same, don't change servers
            if (customServerNetworkId === chainNetworkId) {
              apiServer = customServer;
            } else {
              // If they are different, switch servers
              apiServer = chainIsTestnet
                ? DEFAULT_NETWORK_LIST[DEFAULT_TESTNET_INDEX]?.url
                : defaultApiServer;
              // And, set new cookie
              nookies.set(
                ctx,
                NETWORK_CURRENT_INDEX_COOKIE,
                JSON.stringify(chainIsTestnet ? DEFAULT_TESTNET_INDEX : DEFAULT_MAINNET_INDEX),
                {
                  maxAge: 30 * 24 * 60 * 60,
                  path: '/',
                }
              );
            }
          } catch (e) {
            // If it fails, reset to default
            apiServer = defaultApiServer;
          }
        }
      }
      return apiServer;
    } catch (e) {
      return apiServer;
    }
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

export const getNetworkModeFromNetworkId = (networkId: ChainID) => {
  switch (networkId) {
    case ChainID.Mainnet:
      return NetworkModes.Mainnet;
    case ChainID.Testnet:
      return NetworkModes.Testnet;
    default:
      return undefined;
  }
};
