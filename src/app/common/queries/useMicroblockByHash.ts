import { useApi } from '@/common/api/client';
import { useQuery } from '@tanstack/react-query';

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
