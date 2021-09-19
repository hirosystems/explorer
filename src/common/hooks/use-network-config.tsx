import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { useApiServer } from '@common/hooks/use-api';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { NetworkModes } from '@common/types/network';

// for use with connect
export const useNetworkConfig = (): StacksTestnet | StacksMainnet => {
  const apiServer = useApiServer();
  const { networkMode } = useNetworkMode();
  const Network = networkMode === NetworkModes.Testnet ? StacksTestnet : StacksMainnet;
  const network = new Network();
  network.coreApiUrl = apiServer;
  return network;
};
