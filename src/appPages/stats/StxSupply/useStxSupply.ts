import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';

export const useStxSupply = () => {
  const { infoApi } = useApi();
  const { data: stxSupplyData, isFetching } = useQuery(
    ['stx-supply'],
    () => infoApi.getStxSupply({}),
    {
      staleTime: 30 * 60 * 1000,
    }
  );
  const { total_stx, unlocked_stx, unlocked_percent } = stxSupplyData || {};
  return {
    totalStx: total_stx,
    unlockedStx: unlocked_stx,
    unlockedPercent: unlocked_percent,
    isFetching,
  };
};
