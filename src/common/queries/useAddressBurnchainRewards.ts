import { useSuspenseQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../context/useGlobalContext';

const ADDRESS_BURNCHAIN_REWARDS_QUERY_KEY = 'address-burnchain-rewards';

// TODO: Update StacksJS to support fetching burnchain rewards
export interface AddressBurnchainRewards {
  reward_recipient: 'string';
  reward_amount: 'string';
}

export function useGetAddressBurnChainRewardsQuery() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return (poxAddress: string) => ({
    queryKey: [ADDRESS_BURNCHAIN_REWARDS_QUERY_KEY, poxAddress],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v1/burnchain/rewards/${poxAddress}/total`).then(res =>
        res.json()
      ),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export const useSuspenseAddressBurnchainRewards = (poxAddress: string) => {
  // TODO: check that the address is a valid btc address
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseQuery<AddressBurnchainRewards>({
    queryKey: [ADDRESS_BURNCHAIN_REWARDS_QUERY_KEY, poxAddress],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v1/burnchain/rewards/${poxAddress}/total`).then(res =>
        res.json()
      ),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
