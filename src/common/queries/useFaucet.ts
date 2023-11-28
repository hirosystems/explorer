import { useMutation } from '@tanstack/react-query';

import { useApi } from '../api/useApi';

export function useFaucet() {
  const api = useApi();
  return useMutation({
    mutationFn: ({ address, staking }: { address: string; staking?: boolean }) =>
      api.faucetsApi.runFaucetStx({ address, ...(staking ? { staking: true } : {}) }),
  });
}
