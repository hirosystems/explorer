import { useGlobalContext } from '@/common/context/useAppContext';
import { TEN_MINUTES } from '@/common/queries/query-stale-time';
import { useSuspenseQuery } from '@tanstack/react-query';

const SIGNER_LOCATION_QUERY_KEY = 'signer-addresses';

interface SignerLocation {
  ip: string;
  country: string;
  ll: [number, number];
  public: boolean;
}

export function useSignersLocation() {
  const { activeNetwork } = useGlobalContext();
  return useSuspenseQuery<SignerLocation[]>({
    queryKey: [SIGNER_LOCATION_QUERY_KEY],
    queryFn: () =>
      fetch(`https://assets.hiro.so/stacks/${activeNetwork.mode}/crawler/signer-nodes.json`).then(
        res => res.json()
      ),
    staleTime: TEN_MINUTES,
  });
}
