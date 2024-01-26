import { useGlobalContext } from '../context/useAppContext';

export function useIsNakamoto() {
  const activeNetworkUrl = useGlobalContext().activeNetworkKey;
  return activeNetworkUrl.indexOf('naka') !== -1;
}
