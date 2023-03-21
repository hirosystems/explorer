import { useFtMetadata } from '@/app/common/queries/useFtMetadata';
import { useNftMetadata } from '@/app/common/queries/useNftMetadata';
import { useApi } from '@/common/api/client';
import { getAssetNameParts } from '@/common/utils';

export function useTokenMetadata(
  token: string,
  tokenType: 'non_fungible_tokens' | 'fungible_tokens'
) {
  const { address, contract } = getAssetNameParts(token);
  const api = useApi();
  const contractId = `${address}.${contract}`;
  return {
    ftMetadata: useFtMetadata(
      api,
      { contractId },
      {
        enabled: tokenType === 'fungible_tokens',
      }
    ),
    nftMetadata: useNftMetadata(
      api,
      { contractId, tokenId: 1 },
      {
        enabled: tokenType === 'non_fungible_tokens',
      }
    ),
  };
}
