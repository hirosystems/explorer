import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';

export const useMicroblockByHash = (
  api: ReturnType<typeof useApi>,
  { microblockHash }: { microblockHash: string }
) => {
  return useQuery(
    ['microblockByHash', microblockHash],
    () =>
      api.microblocksApi.getMicroblockByHash({
        hash: microblockHash,
      }),
    { staleTime: Infinity }
  );
};
