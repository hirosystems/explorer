import { useSuspensePoxInfoRaw } from '@/common/queries/usePoxInforRaw';
import { MICROSTACKS_IN_STACKS } from '@/common/utils/utils';

export function useStxSupply() {
  const { data: poxData } = useSuspensePoxInfoRaw();
  const { total_liquid_supply_ustx, current_cycle: { stacked_ustx = 0 } = ({} = {}) } =
    poxData || {};
  return {
    totalSupply: (stacked_ustx + total_liquid_supply_ustx) / MICROSTACKS_IN_STACKS,
    unlockedSupply: total_liquid_supply_ustx / MICROSTACKS_IN_STACKS,
    lockedSupply: stacked_ustx / MICROSTACKS_IN_STACKS,
  };
}
