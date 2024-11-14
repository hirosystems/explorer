import { useQuery } from '@tanstack/react-query';

import { callApiWithErrorHandling } from '../../api/callApiWithErrorHandling';
import { useApiClient } from '../../api/useApiClient';

export const useAddressNonces = ({ address }: { address: string }) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ['addressNonces', address],
    queryFn: async () => {
      return await callApiWithErrorHandling(apiClient, '/extended/v1/address/{principal}/nonces', {
        params: { path: { principal: address } },
      });
    },
  });
};
