import { GetTransactionListTypeEnum } from '@stacks/blockchain-api-client';
import {
  AddressBalanceResponse,
  AddressTransactionsWithTransfersListResponse,
  AddressTransactionWithTransfers,
} from '@stacks/stacks-blockchain-api-types';
import dayjs from 'dayjs';
import { InfiniteData, QueryClient } from 'react-query';
import { microStxToStx, microToStacks, toRelativeTime } from '../utils';

export type CSVDownloadObjectType = {
  Date: string;
  'Sent Amount': string | number;
  'Sent Currency': string;
  'Received Amount': string | number;
  'Received Currency': string;
  'Fee Amount': string | number;
  'Fee Currency': string;
  'Net Worth Amount': string | number;
  'Net Worth Currency': string;
  TxHash: string;
};

export const getTxnData = (
  queryClient: QueryClient,
  activeFilters: Record<GetTransactionListTypeEnum, boolean>,
  address: string
): CSVDownloadObjectType[] => {
  const txsQueryData = queryClient.getQueriesData<
    InfiniteData<AddressTransactionsWithTransfersListResponse>
  >({
    queryKey: ['addressConfirmedTxsWithTransfersInfinite', address],
  });

  const addressBalanceQueryData = queryClient.getQueriesData<AddressBalanceResponse>({
    queryKey: ['accountBalance', address],
  });

  const balance = addressBalanceQueryData[0][1].stx.balance;

  const txs = txsQueryData[0][1].pages.reduce<AddressTransactionWithTransfers[]>(
    (acc, { results }) => {
      return acc.concat(results);
    },
    []
  );

  const filteredTxs = txs?.filter(tx => activeFilters[tx.tx.tx_type]);
  return formatTxns(filteredTxs, balance);
};

const formatTxns = (
  txs: AddressTransactionWithTransfers[],
  balance: string | number
): CSVDownloadObjectType[] => {
  let currentNetWorth = Number(balance);
  return txs.map((transaction, i) => {
    const {
      stx_sent,
      stx_received,
      tx: { burn_block_time, fee_rate, tx_id },
    } = transaction;
    if (i > 0) {
      currentNetWorth += Number(stx_received) - Number(stx_sent);
    }

    return {
      Date: dayjs(burn_block_time * 1000).toISOString(),
      'Sent Amount': microToStacks(stx_sent),
      'Sent Currency': 'STX',
      'Received Amount': microToStacks(stx_received),
      'Received Currency': 'STX',
      'Fee Amount': microToStacks(fee_rate),
      'Fee Currency': 'STX',
      'Net Worth Amount': microStxToStx(currentNetWorth),
      'Net Worth Currency': 'STX',
      TxHash: tx_id,
    };
  });
};
