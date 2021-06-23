import { fetchFromApi } from '@common/api/fetch';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
  DEFAULT_REGTEST_SERVER,
  DEFAULT_V2_INFO_ENDPOINT,
  REGTEST_CHAIN_ID,
  TESTNET_CHAIN_ID,
} from '@common/constants';
import { ChainID } from '@stacks/transactions';
import { NetworkModes } from '@common/types/network';

export async function getNetworkMode(apiServer: string) {
  // if either of defaults, no need to fetch
  if (apiServer === DEFAULT_MAINNET_SERVER) {
    return NetworkModes.Mainnet;
  } else if (apiServer === DEFAULT_TESTNET_SERVER) {
    return NetworkModes.Testnet;
  } else if (apiServer === DEFAULT_REGTEST_SERVER) {
    return NetworkModes.Regtest;
  }
  try {
    const response = await fetchFromApi(apiServer)(DEFAULT_V2_INFO_ENDPOINT);
    const data = await response.json();

    const networkId: ChainID.Mainnet | ChainID.Testnet | undefined =
      data?.network_id && parseInt(data?.network_id);

    const networkMode = networkId
      ? TESTNET_CHAIN_ID === networkId
        ? NetworkModes.Testnet
        : NetworkModes.Mainnet
      : undefined;

    return networkMode;
  } catch (e) {
    return undefined;
  }
}
