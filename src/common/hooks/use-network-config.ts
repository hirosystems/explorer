import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NetworkModes } from '@common/types/network';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { fetchWithApiKey } from '@common/utils/fetchWithApiKey';

// for use with connect
export const useNetworkConfig = (): StacksTestnet | StacksMainnet => {
  const selectedNetwork = useAppSelector(selectActiveNetwork);
  const apiServer = selectedNetwork.url;
  const networkMode = selectedNetwork.mode;
  const Network = networkMode === NetworkModes.Testnet ? StacksTestnet : StacksMainnet;
  const network = new Network({ url: apiServer, fetchFn: fetchWithApiKey });
  return network;
};
