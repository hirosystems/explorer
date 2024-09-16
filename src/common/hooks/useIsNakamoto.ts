import { useGlobalContext } from '../context/useGlobalContext';

export function useRenderNewBlockList() {
  const { activeNetworkKey, activeNetwork } = useGlobalContext();

  const isMainnet = activeNetworkKey === 'https://api.hiro.so';
  const isTestnet = activeNetworkKey === 'https://api.testnet.hiro.so';
  const isNakamotoTestnet = activeNetworkKey === 'https://api.nakamoto.testnet.hiro.so';

  return !isMainnet && !isTestnet && !isNakamotoTestnet;
}
