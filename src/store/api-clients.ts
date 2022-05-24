import { atom } from 'jotai';
import { Configuration } from '@stacks/blockchain-api-client';
import { DEFAULT_MAINNET_SERVER } from '@common/constants';
import { apiClients, createConfig } from '@common/api/client';
import { store } from '@common/state/store';
import { selectActiveNetworkUrl } from '@common/state/network-slice';

export const apiClientConfiguration = atom<Configuration>(() => {
  const networkUrl = selectActiveNetworkUrl(store.getState());
  return createConfig(networkUrl);
});

export const apiClientsState = atom(get => {
  const config = get(apiClientConfiguration);
  return apiClients(config);
});
