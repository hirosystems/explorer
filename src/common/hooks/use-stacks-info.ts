import useSWR from 'swr';
import { fetchFromApi } from '@common/api/fetch';
import { DEFAULT_V2_INFO_ENDPOINT, DEPLOYMENT_URL } from '@common/constants';

export const useStacksInfo = (options?: { initialData?: any; suspense?: boolean }) => {
  return useSWR(
    'useStacksInfo',
    () => fetchFromApi(`${DEPLOYMENT_URL}/api`)(DEFAULT_V2_INFO_ENDPOINT).then(res => res.json()),
    {
      initialData: options?.initialData || null,
    }
  );
};
