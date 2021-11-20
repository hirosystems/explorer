import { NextPageContext } from 'next';
import { QueryClient } from 'react-query';
import { getSingleCachedQueryData } from 'jotai-query-toolkit/nextjs';

import { getContractQueryKeys } from '@store/contracts';
import { getTxQueryKey, TransactionsListResponse } from '@store/transactions';
import { getBlocksQueryKey } from '@store/blocks';

import { getApiClients } from '@common/api/client';
import { assertConfirmedTransaction, getContractIdFromTx, getTxIdFromCtx } from '@common/utils';

import type { GetQueries, Queries } from 'jotai-query-toolkit/nextjs';
import type {
  AddressBalanceResponse,
  MempoolTransaction,
  Transaction,
  MempoolTransactionListResponse,
} from '@stacks/stacks-blockchain-api-types';
import { getAccountQueryKey } from '@store/accounts';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

export interface TxPageQueryProps {
  transaction: Transaction | MempoolTransaction;
  contractInfo?: any;
}

// this will get us our query props data from the react-query cache if it exists
// to prevent duplicate fetching when we don't always need to :)
function getTxPageCachedQueryProps(ctx: NextPageContext, queryClient: QueryClient) {
  const txQuery = getTxIdFromCtx(ctx);
  const isContractId = txQuery.includes('.');
  let cachedContractInfo: undefined | TxPageQueryProps['contractInfo'];
  let cachedTransaction: undefined | TxPageQueryProps['transaction'];
  if (isContractId) {
    cachedContractInfo = getSingleCachedQueryData<TxPageQueryProps['contractInfo']>(
      getContractQueryKeys.info(txQuery),
      queryClient
    );
    if (cachedContractInfo)
      cachedTransaction = getSingleCachedQueryData<TxPageQueryProps['transaction']>(
        getTxQueryKey.single(cachedContractInfo.tx_id),
        queryClient
      );
  } else {
    cachedTransaction = getSingleCachedQueryData<TxPageQueryProps['transaction']>(
      getTxQueryKey.single(txQuery),
      queryClient
    );
  }
  return {
    cachedContractInfo,
    cachedTransaction,
  };
}

// this is our function for fetching the transaction being requested
// the transaction (if found) will be fed as context/props to the getQuerys function
// so our other queries can depend on it
export const getTxPageQueryProps = async (
  ctx: NextPageContext,
  queryClient: QueryClient
): Promise<TxPageQueryProps> => {
  const txQuery = getTxIdFromCtx(ctx);
  const isContractId = txQuery.includes('.');
  const { cachedTransaction, cachedContractInfo } =
    // we can use react-query to get the data if it's been viewed before,
    // and on mount it will automatically revalidate and update if it's different
    getTxPageCachedQueryProps(ctx, queryClient);
  const { bnsApi, transactionsApi, smartContractsApi } = await getApiClients(ctx);

  if (!isContractId) {
    // it's a txid, so we can just return the tx

    if (cachedTransaction) return { transaction: cachedTransaction };

    let transaction = (await transactionsApi.getTransactionById({ txId: txQuery })) as (
      | MempoolTransaction
      | Transaction
    ) & { sender_name: string };
    let res;

    res = await bnsApi.getNamesOwnedByAddress({
      address: transaction.sender_address,
      blockchain: 'stacks',
    });
    if (res.names && res.names.length) transaction.sender_name = res.names[0];

    if (transaction.tx_type === 'token_transfer') {
      res = await bnsApi.getNamesOwnedByAddress({
        address: transaction.token_transfer.recipient_address,
        blockchain: 'stacks',
      });

      // @ts-ignore
      if (res.names && res.names.length) transaction.token_transfer.recipient_name = res.names[0];
    }

    return { transaction };
  }
  // it's a contract principal, so we need to get the info to get the txid
  const contractInfo =
    cachedContractInfo || // if we have a cached contract, use that
    (await smartContractsApi.getContractById({ contractId: txQuery }));
  const transaction =
    cachedTransaction || // if we have a cached tx, use that
    ((await transactionsApi.getTransactionById({
      txId: contractInfo.tx_id, // we are using the contractInfo.tx_id to fetch the underlying transaction
    })) as Transaction | MempoolTransaction);
  return {
    transaction,
    contractInfo,
  };
};

// this is our function for generating our query keys and fetchers for each key
export const getTxPageQueries: GetQueries<TxPageQueryProps> = async (
  // it takes NextPageContext as the first param
  ctx,
  // and `queryProps` as the second (comes from `getQueryProps`)
  queryProps
): Promise<Queries<TxPageQueryProps>> => {
  if (!queryProps) throw Error('No Query props');
  const { transaction, contractInfo } = queryProps;
  // we'll extract our txid from the server context (query param)
  const txId = transaction.tx_id;
  // this is an assertion of a confirmed tx or undefined
  const confirmedTransaction = assertConfirmedTransaction(transaction);
  // if it's a tx that references a contract, this will be a principal
  const contractId = getContractIdFromTx(transaction);
  const isPending = transaction.tx_status === 'pending';
  const isContractDeploy = transaction.tx_type === 'smart_contract';
  const canFetchContractInfo = (!isContractDeploy || !isPending) && !!contractId;

  // we can get our api clients here
  const { smartContractsApi, blocksApi, accountsApi, transactionsApi } = await getApiClients(ctx);

  // our query keys
  const txQueryKey = getTxQueryKey.single(txId);
  // if this is undefined, they query won't be fetched
  const blocksQueryKey =
    confirmedTransaction && getBlocksQueryKey.single(confirmedTransaction.block_hash);
  // if this is undefined, they query won't be fetched
  const contractInfoQueryKey = canFetchContractInfo
    ? getContractQueryKeys.info(
        contractId as string // TS 4.4 should fix this cast
      )
    : undefined;

  // and our final array of query keys and fetchers
  return [
    [txQueryKey, (_ctx, queryProps) => queryProps?.transaction],
    [
      blocksQueryKey,
      () =>
        confirmedTransaction && blocksApi.getBlockByHash({ hash: confirmedTransaction.block_hash }),
    ],
    [
      contractInfoQueryKey,
      () => {
        if (!canFetchContractInfo) return;
        return (
          contractInfo ||
          (contractId &&
            smartContractsApi.getContractById({
              contractId,
            }))
        );
      },
    ],
    [
      contractId && getAccountQueryKey.transactions([contractId, DEFAULT_LIST_LIMIT]),
      async () =>
        contractId &&
        ((await accountsApi.getAccountTransactions({
          principal: contractId,
          offset: 0,
          limit: DEFAULT_LIST_LIMIT,
        })) as TransactionsListResponse),
    ],
    [
      contractId && getAccountQueryKey.pendingTransactions([contractId, DEFAULT_LIST_LIMIT]),
      async () => {
        if (!contractId) return;
        const data = (await transactionsApi.getMempoolTransactionList({
          // the mempool tx endpoint does NOT currently support contract principals
          // @see https://github.com/blockstack/stacks-blockchain-api/issues/605
          offset: 0,
          limit: DEFAULT_LIST_LIMIT,
        })) as MempoolTransactionListResponse;
        return {
          ...data,
          results: data.results.filter(tx => JSON.stringify(tx).includes(contractId)),
        };
      },
    ],
    [
      contractId && getAccountQueryKey.balances(contractId),
      async () =>
        contractId &&
        ((await accountsApi.getAccountBalance({
          principal: contractId,
        })) as AddressBalanceResponse),
    ],
  ];
};
