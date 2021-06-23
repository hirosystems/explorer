import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  TransactionsApi,
  BlocksApi,
  FaucetsApi,
  BnsApi,
  BurnchainApi,
  FeesApi,
  SearchApi,
  RosettaApi,
} from '@stacks/blockchain-api-client';
import { NextPageContext } from 'next';
import { getServerSideApiServer } from '@common/api/utils';
import { fetcher } from '@common/api/fetch';

export function apiClients(config: Configuration) {
  const smartContractsApi = new SmartContractsApi(config);
  const accountsApi = new AccountsApi(config);
  const infoApi = new InfoApi(config);
  const transactionsApi = new TransactionsApi(config);
  const blocksApi = new BlocksApi(config);
  const faucetsApi = new FaucetsApi(config);
  const bnsApi = new BnsApi(config);
  const burnchainApi = new BurnchainApi(config);
  const feesApi = new FeesApi(config);
  const searchApi = new SearchApi(config);
  const rosettaApi = new RosettaApi(config);

  return {
    smartContractsApi,
    accountsApi,
    infoApi,
    transactionsApi,
    blocksApi,
    faucetsApi,
    bnsApi,
    burnchainApi,
    feesApi,
    searchApi,
    rosettaApi,
  };
}

export const getApiClientConfig = async (context: NextPageContext) => {
  const apiServer = await getServerSideApiServer(context);
  return new Configuration({ basePath: apiServer, fetchApi: fetcher });
};
export const getApiClients = async (context: NextPageContext) => {
  const config = await getApiClientConfig(context);
  return apiClients(config);
};
