'use client';

import { TokensApi } from '@hirosystems/token-metadata-api-client';
import { Configuration as TokenMetadataApiConfiguration } from '@hirosystems/token-metadata-api-client/dist/configuration';

import {
  AccountsApi,
  BlocksApi,
  BurnBlocksApi,
  Configuration,
  FaucetsApi,
  FeesApi,
  InfoApi,
  MempoolApi,
  MicroblocksApi,
  Middleware,
  NonFungibleTokensApi,
  RequestContext,
  RosettaApi,
  SearchApi,
  SmartContractsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';

import { MICROBLOCKS_ENABLED } from '../constants/constants';
import { fetcher as fetchApi } from './fetch';

export function apiClients(
  config: Configuration,
  tokenMetadataApiConfig?: TokenMetadataApiConfiguration
) {
  const smartContractsApi = new SmartContractsApi(config);
  const accountsApi = new AccountsApi(config);
  const infoApi = new InfoApi(config);
  const transactionsApi = new TransactionsApi(config);
  const microblocksApi = new MicroblocksApi(config);
  const blocksApi = new BlocksApi(config);
  const burnBlocksApi = new BurnBlocksApi(config);
  const faucetsApi = new FaucetsApi(config);
  const feesApi = new FeesApi(config);
  const searchApi = new SearchApi(config);
  const rosettaApi = new RosettaApi(config);
  const nonFungibleTokensApi = new NonFungibleTokensApi(config);
  const mempoolApi = new MempoolApi(config);
  const tokenMetadataApi = tokenMetadataApiConfig
    ? new TokensApi(tokenMetadataApiConfig)
    : undefined;

  return {
    smartContractsApi,
    accountsApi,
    infoApi,
    transactionsApi,
    microblocksApi,
    blocksApi,
    burnBlocksApi,
    faucetsApi,
    feesApi,
    searchApi,
    rosettaApi,
    nonFungibleTokensApi,
    mempoolApi,
    tokenMetadataApi,
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
export function createConfig(basePath?: string) {
  const middleware: Middleware[] = [];
  if (MICROBLOCKS_ENABLED) middleware.push(unanchoredMiddleware);
  return new Configuration({
    basePath,
    fetchApi,
    middleware,
  });
}
