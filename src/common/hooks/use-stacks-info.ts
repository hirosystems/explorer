import useSWR from 'swr';
import { useApiServer } from '@common/hooks/use-api';
import { fetchFromApi } from '@common/api/fetch';
import { DEFAULT_V2_INFO_ENDPOINT } from '@common/constants';

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
