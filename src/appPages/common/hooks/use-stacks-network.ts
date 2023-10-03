import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { useGlobalContext } from '@/common/context/useAppContext';
import { NetworkModes } from '@/common/types/network';
import { fetchWithApiKey } from '@/common/utils/fetchWithApiKey';

export const useStacksNetwork = (): StacksTestnet | StacksMainnet => {
  const selectedNetwork = useGlobalContext().activeNetwork;
  const apiServer = selectedNetwork.url;
  const networkMode = selectedNetwork.mode;
  const Network = networkMode === NetworkModes.Testnet ? StacksTestnet : StacksMainnet;
  const network = new Network({ url: apiServer, fetchFn: fetchWithApiKey });
  return network;
};
