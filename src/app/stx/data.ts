import { stacksAPIFetchJson } from '@/api/stacksAPIFetch';
import { FtHolderListResponse } from '@/common/types/tokens-v3';

import { OperationResponse } from '@stacks/blockchain-api-client';

const STX_SUPPLY_REVALIDATION_SECONDS = 60;
const STX_HOLDERS_REVALIDATION_SECONDS = 60;

export type StxSupplyResponse = OperationResponse['/extended/v3/tokens/stx/supply'];

export async function fetchStxSupply(apiUrl: string): Promise<StxSupplyResponse> {
  return stacksAPIFetchJson<StxSupplyResponse>(
    `${apiUrl}/extended/v3/tokens/stx/supply`,
    { cache: 'default', next: { revalidate: STX_SUPPLY_REVALIDATION_SECONDS } },
    'Failed to fetch STX supply'
  );
}

export async function fetchStxHolders(apiUrl: string, limit = 10): Promise<FtHolderListResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  return stacksAPIFetchJson<FtHolderListResponse>(
    `${apiUrl}/extended/v3/tokens/stx/holders?${params.toString()}`,
    { cache: 'default', next: { revalidate: STX_HOLDERS_REVALIDATION_SECONDS } },
    'Failed to fetch STX holders'
  );
}
