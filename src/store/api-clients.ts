import { atom } from 'jotai';
import { Configuration } from '@stacks/blockchain-api-client';
import { DEFAULT_MAINNET_SERVER } from '@common/constants';
import { apiClients, createConfig } from '@common/api/client';
import { store } from '@common/state/store';

export const apiClientConfiguration = atom<Configuration>(() => {
  const networkUrl = store.getState().network.activeNetworkKey;
  const apiServer = networkUrl || DEFAULT_MAINNET_SERVER;
  return createConfig(apiServer);
});

export const apiClientsState = atom(get => {
  const config = get(apiClientConfiguration);
  return apiClients(config);
});
