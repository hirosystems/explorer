import { useApi } from '@/common/api/client';
import { useQuery } from 'react-query';

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
