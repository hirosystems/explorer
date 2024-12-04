import { useQuery } from '@tanstack/react-query';

import { useGlobalContext } from '../../../common/context/useGlobalContext';

export function useWhyDidMyTxFail(txId: string) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;
  const txIdWithoutPrefix = txId.replace('0x', '');
  return useQuery({
    queryKey: ['whyDidMyTxFail', txIdWithoutPrefix],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/whydidmytxfail/tx/${txIdWithoutPrefix}/logs`).then(res =>
        res.json()
      ),
  });
}
