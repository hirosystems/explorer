import { atom } from 'jotai';

import { Configuration } from '@stacks/blockchain-api-client';
import { fetcher } from '@common/api/fetch';
import { DEFAULT_MAINNET_SERVER } from '@common/constants';
import { apiClients } from '@common/api/client';

export const apiClientConfiguration = atom<Configuration>(get => {
  // const network = get(currentNetworkState);
  return new Configuration({ basePath: DEFAULT_MAINNET_SERVER, fetchApi: fetcher });
});

export const apiClientsState = atom(get => {
  const config = get(apiClientConfiguration);
  return apiClients(config);
});
