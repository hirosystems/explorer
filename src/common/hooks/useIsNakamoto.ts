import { useGlobalContext } from '../context/useGlobalContext';

export function useRenderNewBlockList() {
  const { activeNetworkKey } = useGlobalContext();

  const isMainnet = activeNetworkKey === 'https://api.hiro.so';

  return !isMainnet;
}
