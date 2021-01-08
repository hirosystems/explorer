import useSWR from 'swr';
import { getNetworkMode } from '@common/api/network';
import { useApiServer } from '@common/hooks/use-api';

export const useNetworkMode = (initialData?: 'Testnet' | 'Mainnet') => {
  const apiServer = useApiServer();
  const { data } = useSWR<'Testnet' | 'Mainnet' | undefined>(
    '/v2/info',
    () => getNetworkMode(apiServer),
    {
      initialData,
    }
  );
  return data;
};
