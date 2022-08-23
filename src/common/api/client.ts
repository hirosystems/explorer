import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  TransactionsApi,
  BlocksApi,
  FaucetsApi,
  FeesApi,
  SearchApi,
  RosettaApi,
  MicroblocksApi,
  FungibleTokensApi,
  NonFungibleTokensApi,
} from '@stacks/blockchain-api-client';
import { fetcher as fetchApi } from '@common/api/fetch';
import type { Middleware, RequestContext } from '@stacks/blockchain-api-client';
import { MICROBLOCKS_ENABLED } from '@common/constants';
import { selectActiveNetwork, selectActiveNetworkUrl } from '@common/state/network-slice';
import { useAppSelector } from '@common/state/hooks';
import { store } from '@common/state/store';

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
    if (!url.toString().includes('/v2')) url.searchParams.set('unanchored', 'true');
    return Promise.resolve({
      init: context.init,
      url: url.toString(),
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

// this is used in next.js specific data fetchers, typically only by getApiClients
// this will pass the correct network url as defined by cookie (or default value)
export const getApiClientConfig = (): Configuration => {
  const apiServer = selectActiveNetworkUrl(store.getState());
  return createConfig(apiServer);
};
// this is used in next.js specific data fetchers to get all our api clients fetching from the correct network url
// only to be used in `getInitialProps` or other next.js data fetching methods
export const getApiClients = async (): Promise<ReturnType<typeof apiClients>> => {
  const config = getApiClientConfig();
  return Promise.resolve(apiClients(config));
};

export const useApi = () => {
  const config = createConfig(useAppSelector(selectActiveNetwork).url);
  return apiClients(config);
};
