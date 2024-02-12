'use client';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import {
  AddressBalanceResponse,
  AddressTransactionWithTransfers,
  AddressTransactionsWithTransfersListResponse,
} from '@stacks/stacks-blockchain-api-types';

import { useFetchAccountBalance } from '../../../common/queries/useAccountBalance';
import { useFetchAddressConfirmedTxsWithTransfers } from '../../../common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { microStxToStx, microToStacksFormatted } from '../../../common/utils/utils';
import { useFilterAndSortState } from '../../txsFilterAndSort/useFilterAndSortState';

const formatTxsCSVData = (
  txs: AddressTransactionWithTransfers[],
  balance: string | number
): CSVDownloadObjectType[] => {
  let stxBalance = Number(balance);
  return txs.map((transaction, i) => {
    const {
      stx_sent,
      stx_received,
      tx: { burn_block_time_iso, fee_rate, tx_id },
    } = transaction;
    if (i > 0) {
      stxBalance += Number(stx_received) - Number(stx_sent);
    }
    return {
      Date: burn_block_time_iso,
      'Sent Amount': microToStacksFormatted(stx_sent),
      'Sent Currency': 'STX',
      'Received Amount': microToStacksFormatted(stx_received),
      'Received Currency': 'STX',
      'Fee Amount': microToStacksFormatted(fee_rate),
      'Fee Currency': 'STX',
      'Net Worth Amount': microStxToStx(stxBalance),
      'Net Worth Currency': 'STX',
      TxHash: tx_id,
    };
  });
};

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

export const useTxsCSVData = () => {
  const queryClient = useQueryClient();
  const { activeFilters } = useFilterAndSortState();

  const getTxsCSVData = (address: string): CSVDownloadObjectType[] => {
    const txsQueryData = queryClient.getQueriesData<
      InfiniteData<AddressTransactionsWithTransfersListResponse>
    >({
      queryKey: ['addressConfirmedTxsWithTransfersInfinite', address],
    });
    const addressBalanceQueryData = queryClient.getQueriesData<AddressBalanceResponse>({
      queryKey: ['accountBalance', address],
    });

    const balance = addressBalanceQueryData[0][1]?.stx.balance;

    const txs = txsQueryData[0][1]?.pages.reduce<AddressTransactionWithTransfers[]>(
      (acc, { results }) => {
        return acc.concat(results);
      },
      []
    );

    const filteredTxs = !activeFilters.length
      ? txs
      : txs?.filter(tx => activeFilters.includes(tx.tx.tx_type));

    console.log({ filteredTxs, balance, txs, activeFilters });

    return filteredTxs && balance ? formatTxsCSVData(filteredTxs, balance) : [];
  };

  return { getTxsCSVData };
};

export const useTxsCSVDataNew = () => {
  // const queryClient = useQueryClient();
  // const { activeFilters } = useFilterAndSortState();
  const fetchAddressConfirmedTxsWithTransfers = useFetchAddressConfirmedTxsWithTransfers();
  const fetchAccountBalance = useFetchAccountBalance();

  const getTxsCSVData = async (address: string): Promise<CSVDownloadObjectType[]> => {
    // const txsQueryData = queryClient.getQueriesData<
    //   InfiniteData<AddressTransactionsWithTransfersListResponse>
    // >({
    //   queryKey: ['addressConfirmedTxsWithTransfersInfinite', address],
    // });
    const txsQueryData = await fetchAddressConfirmedTxsWithTransfers(address);

    // const addressBalanceQueryData = queryClient.getQueriesData<AddressBalanceResponse>({
    //   queryKey: ['accountBalance', address],
    // });

    // const balance = addressBalanceQueryData[0][1]?.stx.balance;
    const balanceData = await fetchAccountBalance(address);
    console.log({ txsQueryData, balanceData });

    // const txs = txsQueryData[0][1]?.pages.reduce<AddressTransactionWithTransfers[]>(
    //   (acc, { results }) => {
    //     return acc.concat(results);
    //   },
    //   []
    // );

    const txs = txsQueryData.results;
    const balance = balanceData.stx.balance;

    // const filteredTxs = !activeFilters.length
    //   ? txs
    //   : txs?.filter(tx => activeFilters.includes(tx.tx.tx_type));

    // return filteredTxs && balance ? formatTxsCSVData(filteredTxs, balance) : [];
    return txs && balance ? formatTxsCSVData(txs, balance) : [];
  };

  return { getTxsCSVData };
};
