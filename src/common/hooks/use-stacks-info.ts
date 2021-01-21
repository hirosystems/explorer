import useSWR from 'swr';
import { fetchFromApi } from '@common/api/fetch';
import { DEFAULT_V2_INFO_ENDPOINT } from '@common/constants';
import { useApiServer } from '@common/hooks/use-api';

export const useStacksInfo = (options?: { initialData?: any; suspense?: boolean }) => {
  const apiServer = useApiServer();
  return useSWR(
    'useStacksInfo',
    () => fetchFromApi(apiServer)(DEFAULT_V2_INFO_ENDPOINT).then(res => res.json()),
    {
      initialData: options?.initialData || null,
    }
  );
};
