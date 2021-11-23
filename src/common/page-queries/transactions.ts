import { GetQueries } from 'jotai-query-toolkit/nextjs';
import { getApiClients } from '@common/api/client';
import { getTxQueryKey, TransactionsListResponse } from '@store/transactions';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { DEFAULT_TX_FILTER_TYPES } from '@store/recoil/filter';

export const getTransactionsPageQueries: GetQueries = async ctx => {
  const { bnsApi, transactionsApi } = await getApiClients(ctx);
  return [
    [
      getTxQueryKey.confirmed(DEFAULT_LIST_LIMIT, DEFAULT_TX_FILTER_TYPES),
      async () => {
        let transactions = (await transactionsApi.getTransactionList({
          limit: DEFAULT_LIST_LIMIT,
          offset: 0,
          type: DEFAULT_TX_FILTER_TYPES,
        })) as TransactionsListResponse;

        for (let i = 0; i < transactions.results.length; i++) {
          const transaction = transactions.results[i];

          const { names } = await bnsApi.getNamesOwnedByAddress({
            address: transaction.sender_address,
            blockchain: 'stacks',
          });
          if (names && names.length) transactions.results[i].sender_name = names[0];

          if (transaction.tx_type === 'token_transfer') {
            const { names } = await bnsApi.getNamesOwnedByAddress({
              address: transaction.token_transfer.recipient_address,
              blockchain: 'stacks',
            });

            if (names && names.length)
              transactions.results[i].token_transfer!.recipient_name = names[0];
          }
        }

        return transactions;
      },
    ],
    [
      getTxQueryKey.mempool(DEFAULT_LIST_LIMIT),
      async () => {
        return (await transactionsApi.getMempoolTransactionList({
          limit: DEFAULT_LIST_LIMIT,
          offset: 0,
        })) as TransactionsListResponse;
      },
    ],
  ];
};
