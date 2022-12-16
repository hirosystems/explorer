import { useQuery } from 'react-query';

import { useApi } from '@common/api/client';
import { getAssetNameParts } from '@common/utils';

export function useTokenMetadata(
  token: string,
  tokenType: 'non_fungible_tokens' | 'fungible_tokens'
) {
  const { address, contract } = getAssetNameParts(token);
  const { fungibleTokensApi, nonFungibleTokensApi } = useApi();
  const T_24H_IN_MS = 1000 * 60 * 60 * 24;
  return {
    ftMetadata: useQuery(
      ['ft-metadata', token],
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
    ),
    nftMetadata: useQuery(
      ['nft-metadata', token],
      () => {
        const contractId = `${address}.${contract}`;
        return nonFungibleTokensApi.getContractNftMetadata({ contractId });
      },
      {
        staleTime: T_24H_IN_MS,
        enabled: false, // disable till API support. tokenType === 'non_fungible_tokens',
      }
    ),
  };
}
