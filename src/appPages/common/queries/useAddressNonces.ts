import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';

export const useAddressNonces = (
  api: ReturnType<typeof useApi>,
  { address }: { address: string }
) => {
  return useQuery(['addressNonces', address], () =>
    api.accountsApi.getAccountNonces({
      principal: address,
    })
  );
};
