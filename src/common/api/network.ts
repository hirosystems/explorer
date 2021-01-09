import { fetchFromApi } from '@common/api/fetch';
import { TESTNET_CHAIN_ID } from '@common/constants';
import { ChainID } from '@stacks/transactions';
import { NetworkModes } from '@common/types/network';

export async function getNetworkMode(apiServer: string) {
  try {
    const response = await fetchFromApi(apiServer)('/v2/info');
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
