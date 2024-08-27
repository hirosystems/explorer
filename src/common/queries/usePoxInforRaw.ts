import { useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../context/useGlobalContext';

// import {  } from '@stacks/stacks-blockchain-api-types'; // TODO: ask for PoxInfo type

interface PoxInfo {
  contract_id: string;
  pox_activation_threshold_ustx: number;
  first_burnchain_block_height: number;
  current_burnchain_block_height: number;
  prepare_phase_block_length: number;
  reward_phase_block_length: number;
  reward_slots: number;
  rejection_fraction: number;
  total_liquid_supply_ustx: number;
  current_cycle: {
    id: number;
    min_threshold_ustx: number;
    stacked_ustx: number;
    is_pox_active: boolean;
  };
  next_cycle: {
    id: number;
    min_threshold_ustx: number;
    min_increment_ustx: number;
    stacked_ustx: number;
    prepare_phase_start_block_height: number;
    blocks_until_prepare_phase: number;
    reward_phase_start_block_height: number;
    blocks_until_reward_phase: number;
    ustx_until_pox_rejection: number;
  };
  min_amount_ustx: number;
  prepare_cycle_length: number;
  reward_cycle_id: number;
  reward_cycle_length: number;
  rejection_votes_left_required: number;
  next_reward_cycle_in: number;
  contract_versions: [
    {
      contract_id: string;
      activation_burnchain_block_height: number;
      first_reward_cycle_id: number;
    },
    {
      contract_id: string;
      activation_burnchain_block_height: number;
      first_reward_cycle_id: number;
    },
    {
      contract_id: string;
      activation_burnchain_block_height: number;
      first_reward_cycle_id: number;
    },
  ];
}

export function useSuspensePoxInfoRaw() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  return useSuspenseQuery<PoxInfo>({
    queryKey: ['pox-info-raw'],
    queryFn: () => fetch(`${activeNetworkUrl}/v2/pox`).then(res => res.json()),
    staleTime: 30 * 60 * 1000,
  });
}
