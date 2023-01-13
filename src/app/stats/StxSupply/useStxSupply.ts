import { useApi } from '@/common/api/client';
import { useQuery } from 'react-query';

export const useStxSupply = () => {
  const { infoApi } = useApi();
  const { data: stxSupplyData } = useQuery('stx-supply', () => infoApi.getStxSupply({}), {
    suspense: true,
    staleTime: 30 * 60 * 1000,
  });
  const { total_stx, unlocked_stx, unlocked_percent } = stxSupplyData || {};
  return {
    totalStx: total_stx,
    unlockedStx: unlocked_stx,
    unlockedPercent: unlocked_percent,
  };
};
