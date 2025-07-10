import { TX_TABLE_PAGE_SIZE } from '@/common/components/table/table-examples/consts';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { getApiUrl } from '@/common/utils/network-utils';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { CompressedMempoolTxTableData, compressMempoolTransactions } from '../transactions/utils';

export async function fetchMempoolTransactions(
  chain: string,
  api?: string,
  fromAddress?: string,
  toAddress?: string
) {
  const apiUrl = getApiUrl(chain, api);
  const params = new URLSearchParams({
    limit: `${TX_TABLE_PAGE_SIZE}`,
    offset: '0',
    ...(fromAddress && { sender_address: fromAddress }),
    ...(toAddress && { recipient_address: toAddress }),
  });

  const response = await fetch(`${apiUrl}/extended/v1/tx/mempool?${params.toString()}`, {
    cache: 'default',
    next: {
      revalidate: 10, // 10 seconds
      tags: ['mempool-transactions'],
    },
  });
  return response;
}

export async function fetchUIMempoolTransactions(
  chain: string,
  api?: string,
  fromAddress?: string,
  toAddress?: string
): Promise<GenericResponseType<CompressedMempoolTxTableData>> {
  const response = await fetchMempoolTransactions(chain, api, fromAddress, toAddress);
  const data = await response.json();
  return {
    ...data,
    results: compressMempoolTransactions(data.results),
  };
}
