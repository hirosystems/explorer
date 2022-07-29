import { getAssetNameParts } from '@common/utils';
import { useApi } from '@common/api/client';
import { useQuery } from 'react-query';

export function useTokenMetadata(
  token: string,
  tokenType: 'non_fungible_tokens' | 'fungible_tokens'
) {
  const { address, contract, asset } = getAssetNameParts(token);
  const { fungibleTokensApi } = useApi();
  const T_24H_IN_MS = 1000 * 60 * 60 * 24;
  return useQuery(
    ['token-metadata', token],
    () => {
      const contractId = `${address}.${contract}`;
      return fungibleTokensApi.getContractFtMetadata({
        contractId,
      });
    },
    {
      staleTime: T_24H_IN_MS,
      enabled: tokenType === 'fungible_tokens',
    }
  );
}
