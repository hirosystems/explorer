import { StacksMainnet, StacksTestnet } from '@stacks/network';

import { useGlobalContext } from '../context/useGlobalContext';
import { NetworkModes } from '../types/network';
import { fetchWithApiKey } from '../utils/fetchWithApiKey';

export const useStacksNetwork = (): StacksTestnet | StacksMainnet => {
  const selectedNetwork = useGlobalContext().activeNetwork;
  const apiServer = selectedNetwork.url;
  const networkMode = selectedNetwork.mode;
  const Network = networkMode === NetworkModes.Mainnet ? StacksMainnet : StacksTestnet; // default to testnet if network id / mode is not known
  const network = new Network({ url: apiServer, fetchFn: fetchWithApiKey });
  network.chainId = selectedNetwork.networkId;
  return network;
};
