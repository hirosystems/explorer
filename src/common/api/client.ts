import { fetcher as fetchApi } from '@/common/api/fetch';
import { MICROBLOCKS_ENABLED } from '@/common/constants';
import { useGlobalContext } from '@/common/context/useAppContext';

import type { Middleware, RequestContext } from '@stacks/blockchain-api-client';
import {
  AccountsApi,
  BlocksApi,
  Configuration,
  FaucetsApi,
  FeesApi,
  FungibleTokensApi,
  InfoApi,
  MicroblocksApi,
  NonFungibleTokensApi,
  RosettaApi,
  SearchApi,
  SmartContractsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';

/**
 * Our mega api clients function. This is a combo of all clients that the blockchain-api-client package offers.
 * @param config - the `@stacks/blockchain-api-client` configuration object
 */
export function apiClients(config: Configuration) {
  const smartContractsApi = new SmartContractsApi(config);
  const accountsApi = new AccountsApi(config);
  const infoApi = new InfoApi(config);
  const transactionsApi = new TransactionsApi(config);
  const microblocksApi = new MicroblocksApi(config);
  const blocksApi = new BlocksApi(config);
  const faucetsApi = new FaucetsApi(config);
  const feesApi = new FeesApi(config);
  const searchApi = new SearchApi(config);
  const rosettaApi = new RosettaApi(config);
  const fungibleTokensApi = new FungibleTokensApi(config);
  const nonFungibleTokensApi = new NonFungibleTokensApi(config);

  return {
    smartContractsApi,
    accountsApi,
    infoApi,
    transactionsApi,
    microblocksApi,
    blocksApi,
    faucetsApi,
    feesApi,
    searchApi,
    rosettaApi,
    fungibleTokensApi,
    nonFungibleTokensApi,
    config,
  };
}

// this is used to enable automatic passing of `unanchored=true` to all requests
const unanchoredMiddleware: Middleware = {
  pre: (context: RequestContext) => {
    const url = new URL(context.url);
    let urlStr = url.toString();
    if (urlStr.includes('/ft/metadata')) {
      urlStr += '/';
    } else if (!urlStr.includes('/v2')) {
      url.searchParams.set('unanchored', 'true');
      urlStr = url.toString();
    }
    return Promise.resolve({
      init: context.init,
      url: urlStr,
    });
  },
};

// we use to to create our api client config on both the server and client
export function createConfig(basePath?: string) {
  const middleware: Middleware[] = [];
  if (MICROBLOCKS_ENABLED) middleware.push(unanchoredMiddleware);
  return new Configuration({
    basePath,
    fetchApi,
    middleware,
  });
}

export const useApi = () => {
  const config = createConfig(useGlobalContext().activeNetwork.url);
  return apiClients(config);
};
