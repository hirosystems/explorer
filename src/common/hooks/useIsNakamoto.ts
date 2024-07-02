import { useGlobalContext } from '../context/useGlobalContext';
import { NetworkModes } from '../types/network';

export function useIsNakamoto() {
  const activeNetworkUrl = useGlobalContext().activeNetworkKey;
  return activeNetworkUrl.indexOf('naka') !== -1;
}

export function useIsNakamoto1Testnet() {
  const { activeNetworkKey, activeNetwork } = useGlobalContext();
  const chain = activeNetwork.mode;
  const isNaka1Testnet =
    chain === NetworkModes.Testnet && activeNetworkKey.indexOf('nakamoto-1') !== -1;
  return isNaka1Testnet;
}
