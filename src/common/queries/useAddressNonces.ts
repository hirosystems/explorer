import { useQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';

export const useAddressNonces = ({ address }: { address: string }) => {
  const api = useApi();
  return useQuery({
    queryKey: ['addressNonces', address],
    queryFn: () =>
      api.accountsApi.getAccountNonces({
        principal: address,
      }),
  });
};
