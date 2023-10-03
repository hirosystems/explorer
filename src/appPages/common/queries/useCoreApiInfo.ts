import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';

export const useCoreApiInfo = (api: ReturnType<typeof useApi>) => {
  return useQuery(['coreApiInfo'], () => api.infoApi.getCoreApiInfo(), {});
};
