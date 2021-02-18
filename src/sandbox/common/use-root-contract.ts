import { useApiServer } from '@common/hooks/use-api';
import useSWR from 'swr';

export const useRootContractAddress = () => {
  const apiServer = useApiServer();
  const { data } = useSWR(
    'poxInfo',
    async () => {
      const res = await fetch(`${apiServer}/v2/pox`);
      return res.json();
    },
    { suspense: true }
  );
  return data?.contract_id?.split('.')?.[0];
};
