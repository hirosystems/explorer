import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '../../api/getErrorMessage';
import { useApiClient } from '../../api/useApiClient';

export function useFaucet() {
  const apiClient = useApiClient();
  return useMutation({
    mutationFn: async ({ address, staking }: { address: string; staking?: boolean }) => {
      if (!address) return undefined;
      const { data, error } = await apiClient.POST('/extended/v1/faucets/stx', {
        body: { address, ...(staking ? { staking: true } : {}) },
      });
      if (error) {
        throw new Error(getErrorMessage(error));
      }
      return data;
    },
  });
}
