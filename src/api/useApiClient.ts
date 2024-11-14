import { useGlobalContext } from '../common/context/useGlobalContext';

export function useApiClient() {
  return useGlobalContext().apiClient;
}
