import { NextPageContext } from 'next';
import { GetQueries } from 'jotai-query-toolkit/ts3.4/nextjs';
import { getAccountQueryKey } from '@store/accounts';
import { getApiClients } from '@common/api/client';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { MempoolTransactionListResponse } from '@stacks/stacks-blockchain-api-types';

export function getPrincipalFromCtx(ctx: NextPageContext) {
  const { query } = ctx;
  const principal: string = query?.principal as string;
  return principal;
}

export const getAccountPageQueries: GetQueries = async ctx => {
  const principal = getPrincipalFromCtx(ctx);
  const { accountsApi, transactionsApi } = await getApiClients(ctx);
  return [
    [
      getAccountQueryKey.balances(principal),
      async () => accountsApi.getAccountBalance({ principal }),
    ],
    [getAccountQueryKey.info(principal), async () => accountsApi.getAccountInfo({ principal })],
    [
      getAccountQueryKey.transactions([principal, DEFAULT_LIST_LIMIT]),
      async () => accountsApi.getAccountTransactions({ principal, limit: DEFAULT_LIST_LIMIT }),
    ],
    [
      getAccountQueryKey.pendingTransactions([principal, DEFAULT_LIST_LIMIT]),
      async () => {
        const isContractId = principal.includes('.');
        const data = (await transactionsApi.getMempoolTransactionList({
          // the mempool tx endpoint does NOT currently support contract principals
          // @see https://github.com/blockstack/stacks-blockchain-api/issues/605
          address: isContractId ? undefined : principal,
          offset: 0,
          limit: DEFAULT_LIST_LIMIT,
        })) as MempoolTransactionListResponse;
        if (!isContractId) return data;
        return {
          ...data,
          results: data.results.filter(tx => JSON.stringify(tx).includes(principal)),
        };
      },
    ],
  ];
};
