import { useApi } from '@/common/api/client';
import { useQuery } from '@tanstack/react-query';

export const useCoreApiInfo = (api: ReturnType<typeof useApi>) => {
  return useQuery(['coreApiInfo'], () => api.infoApi.getCoreApiInfo(), {});
};
