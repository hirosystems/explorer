import { useGlobalContext } from '../context/useGlobalContext';

export function useIsNakamoto() {
  const activeNetworkUrl = useGlobalContext().activeNetworkKey;
  return activeNetworkUrl.indexOf('naka') !== -1;
}
