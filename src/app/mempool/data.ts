import { TX_TABLE_PAGE_SIZE } from '@/common/components/table/table-examples/consts';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { getApiUrl } from '@/common/utils/network-utils';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { CompressedMempoolTxTableData, compressMempoolTransactions } from '../transactions/utils';

export async function fetchMempoolTransactions(chain: string, api?: string) {
  const apiUrl = getApiUrl(chain, api);
  const response = await fetch(
    `${apiUrl}/extended/v1/tx/mempool?limit=${TX_TABLE_PAGE_SIZE}&offset=0`,
    {
      cache: 'default',
      next: {
        revalidate: 10, // 10 seconds
        tags: ['mempool-transactions'],
      },
    }
  );
  return response;
}

export async function fetchUIMempoolTransactions(
  chain: string,
  api?: string
): Promise<GenericResponseType<CompressedMempoolTxTableData>> {
  const response = await fetchMempoolTransactions(chain, api);
  const data = await response.json();
  return {
    ...data,
    results: compressMempoolTransactions(data.results),
  };
}
