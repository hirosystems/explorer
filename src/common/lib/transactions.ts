import type {
  MempoolTransactionListResponse,
  TransactionResults as TransactionListResponse,
} from '@stacks/stacks-blockchain-api-types';
import { fetchFromSidecar } from '@common/api/fetch';
import { generateTransactionsQueryPath } from '@common/lib/utils';
import type { FetchTransactionsBase } from '@common/lib/types';

/**
 * Fetch list of confirmed or pending txs
 */
export function fetchTransactionsList(apiServer: string) {
  return async function (
    path: string
  ): Promise<TransactionListResponse | MempoolTransactionListResponse | any> {
    const resp = await fetchFromSidecar(apiServer)(`/tx${path}`);
    const data = await resp.json();
    return data;
  };
}

/**
 * Preload react-query data on the server for transactions list data
 */
export function preloadTransactionsListData(opts: {
  queryClient: any;
  apiServer: string;
  options: FetchTransactionsBase;
}): any {
  const { options, apiServer, queryClient } = opts;
  const makeKey = ({ pageParam = 0 }) =>
    generateTransactionsQueryPath({
      ...options,
      page: pageParam,
    });
  return queryClient.prefetchInfiniteQuery(
    [options.key, options],
    async () =>
      fetchTransactionsList(apiServer)(
        makeKey({
          ...options,
          pageParam: 0,
        })
      ),
    {
      getNextPageParam: (lastPage: MempoolTransactionListResponse | TransactionListResponse) => {
        const { limit, offset, total } = lastPage;
        const sum = offset + limit;
        return sum < total ? sum : null;
      },
    }
  );
}
