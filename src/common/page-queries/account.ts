import { NextPageContext } from 'next';
import { GetQueries } from 'jotai-query-toolkit/ts3.4/nextjs';
import { getAccountQueryKey } from '@store/accounts';
import { getApiClients } from '@common/api/client';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { MempoolTransactionListResponse } from '@stacks/stacks-blockchain-api-types';
import { InfoQueryKeys } from '@store/info';

export async function getPrincipalFromCtx(ctx: NextPageContext) {
  const { query } = ctx;
  let principal: string = query?.principal as string;

  // TODO: Is this the correct place for this?
  if (principal.endsWith('.stx')) {
    const { bnsApi } = await getApiClients(ctx);

    try {
      const res = await bnsApi.getNameInfo({
        name: principal,
      });

      principal = res.address;
    } catch {
      principal = '';
    }
  }

  return principal;
}

export const getAccountPageQueries: GetQueries = async ctx => {
  const principal = await getPrincipalFromCtx(ctx);
  const { accountsApi, bnsApi, transactionsApi, infoApi } = await getApiClients(ctx);

  return [
    [InfoQueryKeys.INFO, async () => infoApi.getCoreApiInfo()],
    [
      getAccountQueryKey.name(principal),
      async () => {
        const res = await bnsApi.getNamesOwnedByAddress({
          address: principal,
          blockchain: 'stacks',
        });

        return res.names ? res.names[0] : undefined;
      },
    ],
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
