import { fetchFromApi } from '@common/api/fetch';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
  DEFAULT_V2_INFO_ENDPOINT,
  MAINNET_CHAIN_ID,
} from '@common/constants';
import { ChainID } from '@stacks/transactions';
import { NetworkMode, NetworkModes } from '@common/types/network';

export async function getNetworkMode(apiServer: string): Promise<NetworkMode> {
  // Defaults
  let networkMode: NetworkModes = NetworkModes.Mainnet;
  // If it is a default network, there is no need to fetch the chain id
  if (apiServer === DEFAULT_MAINNET_SERVER) {
    return networkMode;
  } else if (apiServer === DEFAULT_TESTNET_SERVER) {
    networkMode = NetworkModes.Testnet;
    return networkMode;
  }
  // If it is a custom network, fetch the chain id and use it
  // to return the correct network mode (mainnet or testnet)
  try {
    const response = await fetchFromApi(apiServer)(DEFAULT_V2_INFO_ENDPOINT);
    const data = await response.json();

    const networkId: ChainID.Mainnet | ChainID.Testnet =
      data?.network_id && parseInt(data?.network_id);

    networkMode = networkId === MAINNET_CHAIN_ID ? NetworkModes.Mainnet : NetworkModes.Testnet;

    return networkMode;
  } catch (e) {
    // Fallback to the defaults
    networkMode = NetworkModes.Mainnet;
    return networkMode;
  }
}
