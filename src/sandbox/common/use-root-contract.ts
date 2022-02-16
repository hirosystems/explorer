import useSWR from 'swr';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

export const useRootContractAddress = () => {
  const apiServer = useAppSelector(selectActiveNetwork).url;
  const { data } = useSWR(
    'poxInfo',
    async () => {
      const res = await fetch(`${apiServer}/v2/pox`);
      return res.json();
    },
    { suspense: true }
  );
  return data?.contract_id?.split('.')?.[0];
};
