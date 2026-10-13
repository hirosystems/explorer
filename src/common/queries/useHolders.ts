import { callApiWithErrorHandling } from '@/api/callApiWithErrorHandling';
import { useApiClient } from '@/api/useApiClient';
import { STX_ASSET_ID } from '@/app/stx/consts';
import { FtHolderListResponse } from '@/common/types/tokens-v3';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

const DEFAULT_HOLDER_LIMIT = 20;
const HOLDERS_QUERY_KEY = 'holders';
const TOKEN_SUPPLY_QUERY_KEY = 'token-supply';

export function getHoldersQueryKey(assetId: string, limit?: number, cursor?: string) {
  return [HOLDERS_QUERY_KEY, assetId, limit, cursor];
}

/**
 * Holders of a fungible token, or of STX when `assetId` is `stx`. Cursor-paginated: pass the
 * previous page's `cursor.next` to get the following page.
 */
export function useHolders(
  assetId: string,
  limit = DEFAULT_HOLDER_LIMIT,
  cursor?: string,
  options: any = {}
): UseQueryResult<FtHolderListResponse> {
  const apiClient = useApiClient();

  return useQuery<FtHolderListResponse>({
    queryKey: getHoldersQueryKey(assetId, limit, cursor),
    queryFn: async () => {
      if (!assetId) return undefined;
      const query = { limit, ...(cursor && { cursor }) };
      if (assetId === STX_ASSET_ID) {
        return await callApiWithErrorHandling(apiClient, '/extended/v3/tokens/stx/holders', {
          params: { query },
        });
      }
      return await callApiWithErrorHandling(
        apiClient,
        '/extended/v3/tokens/ft/{asset_identifier}/holders',
        { params: { path: { asset_identifier: assetId }, query } }
      );
    },
    enabled: !!assetId,
    ...options,
  });
}

/**
 * Total supply of a fungible token, or of STX when `assetId` is `stx`, as a string-quoted integer
 * in the token's base units.
 */
export function useTokenSupply(assetId: string, options: any = {}): UseQueryResult<string> {
  const apiClient = useApiClient();

  return useQuery<string>({
    queryKey: [TOKEN_SUPPLY_QUERY_KEY, assetId],
    queryFn: async () => {
      if (assetId === STX_ASSET_ID) {
        const supply = await callApiWithErrorHandling(apiClient, '/extended/v3/tokens/stx/supply');
        return supply.total;
      }
      const supply = await callApiWithErrorHandling(
        apiClient,
        '/extended/v3/tokens/ft/{asset_identifier}/supply',
        { params: { path: { asset_identifier: assetId } } }
      );
      return supply.total;
    },
    enabled: !!assetId,
    ...options,
  });
}
