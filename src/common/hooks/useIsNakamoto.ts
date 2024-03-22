import { useGlobalContext } from '../context/useAppContext';
import { NetworkModes } from '../types/network';

export function useIsNakamoto() {
  const { activeNetwork, activeNetworkKey } = useGlobalContext();
  const activeNetworkMode = activeNetwork.mode;
  return activeNetworkMode === NetworkModes.Testnet || activeNetworkKey.indexOf('naka') !== -1;
}
