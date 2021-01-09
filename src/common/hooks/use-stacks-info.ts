import useSWR from 'swr';
import { useApiServer } from '@common/hooks/use-api';

export const useStacksInfo = (options?: { initialData?: any; suspense?: boolean }) => {
  const apiServer = useApiServer();
  const swrResponse = useSWR('info', () => fetch(`${apiServer}/v2/info`).then(res => res.json()), {
    initialData: options?.initialData || null,
  });

  return swrResponse;
};
