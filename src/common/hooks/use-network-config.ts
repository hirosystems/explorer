import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NetworkModes } from '@common/types/network';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

// for use with connect
export const useNetworkConfig = (): StacksTestnet | StacksMainnet => {
  const selectedNetwork = useAppSelector(selectActiveNetwork);
  const apiServer = selectedNetwork.url;
  const networkMode = selectedNetwork.mode;
  const Network = networkMode === NetworkModes.Testnet ? StacksTestnet : StacksMainnet;
  const network = new Network();
  network.coreApiUrl = apiServer;
  return network;
};
