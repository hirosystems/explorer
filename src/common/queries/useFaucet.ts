import { useMutation } from '@tanstack/react-query';

import { getErrorMessage } from '../../api/getErrorMessage';
import { useApiClient } from '../../api/useApiClient';

export function useFaucet() {
  const apiClient = useApiClient();
  return useMutation({
    mutationFn: async ({ address, stacking }: { address: string; stacking?: boolean }) => {
      if (!address) return undefined;
      const { data, error } = await apiClient.POST(`/extended/v1/faucets/stx`, {
        params: {
          query: {
            address,
            stacking,
          },
        },
        body: {
          // @ts-expect-error
          content: 'application/json',
        },
      });

      if (error) {
        throw new Error(getErrorMessage(error));
      }
      return data;
    },
  });
}
