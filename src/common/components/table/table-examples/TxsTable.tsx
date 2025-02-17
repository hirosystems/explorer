'use client';

import { useInfiniteQueryResult } from '@/common/hooks/useInfiniteQueryResult';
import { useConfirmedTransactionsInfinite } from '@/common/queries/useConfirmedTransactionsInfinite';
import { microToStacksFormatted, truncateMiddle } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Table as ChakraTable, Flex, Icon } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { ArrowRight, ArrowsClockwise } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { ColumnDefinition, Table } from '../Table';
import { TableContainer } from '../TableContainer';
import {
  AddressLinkCellRenderer,
  FeeCellRenderer,
  IconCellRenderer,
  TimeStampCellRenderer,
  TransactionTitleCellRenderer,
  TxLinkCellRenderer,
  TxTypeCellRenderer,
} from './TxTableCellRenderers';

export enum TxTableColumns {
  Transaction = 'transaction',
  TxId = 'txId',
  TxType = 'txType',
  From = 'from',
  ArrowRight = 'arrowRight',
  To = 'to',
  BlockTime = 'blockTime',
  Amount = 'amount',
  Fee = 'fee',
}

export interface TxTableData {
  [TxTableColumns.Transaction]: TxTableTransactionColumnData;
  [TxTableColumns.TxId]: string;
  [TxTableColumns.TxType]: string;
  [TxTableColumns.From]: string;
  [TxTableColumns.ArrowRight]: JSX.Element;
  [TxTableColumns.To]: string;
  [TxTableColumns.BlockTime]: number;
  [TxTableColumns.Amount]: number;
  [TxTableColumns.Fee]: string;
}

export function getToAddress(tx: Transaction): string {
  if (tx.tx_type === 'token_transfer') {
    return tx.token_transfer?.recipient_address;
  }
  if (tx.tx_type === 'smart_contract') {
    return tx.smart_contract?.contract_id;
  }
  if (tx.tx_type === 'contract_call') {
    return tx.contract_call?.contract_id;
  }
  if (tx.tx_type === 'coinbase') {
    return tx.coinbase_payload?.alt_recipient ?? '';
  }
  return '';
}

export function getAmount(tx: Transaction): number {
  if (tx.tx_type === 'token_transfer') {
    return Number(tx.token_transfer?.amount);
  }
  return 0;
}

// TODO: API doesn't return any information about the token, eg it's name, symbol, tokenImage, etc. Open a ticket to get this added.
// export function getAmountSymbol(tx: Transaction): string {
//   if (tx.tx_type === 'token_transfer') {
//     return tx.token_transfer?.token_symbol ?? '';
//   }
//   return '';
// }

export function formatBlockTime(timestamp: number): string {
  const date = new UTCDate(timestamp * 1000);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (UTC)`;
}

export interface TxTableTransactionColumnData {
  amount?: string;
  functionName?: string;
  contractName?: string;
  txType?: Transaction['tx_type'];
  status?: Transaction['tx_status'];
}

export const columnDefinitions: ColumnDefinition<TxTableData, any>[] = [
  {
    id: TxTableColumns.Transaction,
    header: 'Transaction',
    accessor: (row: TxTableData) => row[TxTableColumns.Transaction],
    cellRenderer: TransactionTitleCellRenderer,
  } as ColumnDefinition<TxTableData, TxTableTransactionColumnData>,
  {
    id: TxTableColumns.TxId,
    header: 'ID',
    accessor: (row: TxTableData) => truncateMiddle(row[TxTableColumns.TxId]),
    cellRenderer: TxLinkCellRenderer,
  } as ColumnDefinition<TxTableData, string>,
  {
    id: TxTableColumns.TxType,
    header: 'Tx Type',
    accessor: (row: TxTableData) => row[TxTableColumns.TxType],
    cellRenderer: value => <TxTypeCellRenderer txType={value} />,
  } as ColumnDefinition<TxTableData, string>,
  {
    id: TxTableColumns.From,
    header: 'From',
    accessor: (row: TxTableData) => truncateMiddle(row[TxTableColumns.From]),
    cellRenderer: AddressLinkCellRenderer,
  } as ColumnDefinition<TxTableData, string>,
  {
    id: TxTableColumns.ArrowRight,
    header: '',
    accessor: (row: TxTableData) => row[TxTableColumns.ArrowRight],
    cellRenderer: IconCellRenderer,
  } as ColumnDefinition<TxTableData, React.ReactNode>,
  {
    id: TxTableColumns.To,
    header: 'To',
    accessor: (row: TxTableData) => truncateMiddle(row[TxTableColumns.To]),
    cellRenderer: AddressLinkCellRenderer,
  } as ColumnDefinition<TxTableData, string>,
  {
    id: TxTableColumns.Fee,
    header: 'Fee',
    accessor: (row: TxTableData) => microToStacksFormatted(row[TxTableColumns.Fee]),
    cellRenderer: FeeCellRenderer,
  } as ColumnDefinition<TxTableData, string>,
  // {
  //   id: TxTableColumns.Amount,
  //   header: 'Amount',
  //   accessor: (row: TxTableData) => row[TxTableColumns.Amount],
  //   cellRenderer: AmountCellRenderer,
  // } as ColumnDefinition<TxTableData, number>,
  {
    id: TxTableColumns.BlockTime,
    header: 'Block Time',
    accessor: (row: TxTableData) => formatBlockTime(row[TxTableColumns.BlockTime]),
    cellRenderer: TimeStampCellRenderer,
  } as ColumnDefinition<TxTableData, string>,
];

export function UpdateTableBannerRow() {
  const numColumns = Object.keys(TxTableColumns).length;

  return (
    <ChakraTable.Row
      css={{
        '& > td:first-of-type': {
          borderTopLeftRadius: 'redesign.md',
          borderBottomLeftRadius: 'redesign.md',
        },
        '& > td:last-of-type': {
          borderTopRightRadius: 'redesign.md',
          borderBottomRightRadius: 'redesign.md',
        },
      }}
    >
      <ChakraTable.Cell colSpan={numColumns} py={2} px={1}>
        <Flex
          alignItems="center"
          justifyContent="center"
          gap={1.5}
          boxShadow="0px 4px 12px 0px color(display-p3 0.9882 0.3922 0.1961 / 0.25), 0px 4px 12px 0px rgba(255, 85, 18, 0.25)"
          border="1px dashed var(--stacks-colors-accent-stacks-500)"
          borderRadius="redesign.lg"
          h={12}
        >
          <Text fontSize="sm" fontWeight="medium" color="textSecondary">
            New transactions have come in. Update list
          </Text>
          <Icon h={3.5} w={3.5} color="iconTertiary">
            <ArrowsClockwise />
          </Icon>
        </Flex>
      </ChakraTable.Cell>
    </ChakraTable.Row>
  );
}

export function TxsTable() {
  const response = useConfirmedTransactionsInfinite();
  const txs = useInfiniteQueryResult<Transaction>(response, 100);

  const rowData: TxTableData[] = useMemo(
    () =>
      txs.map(tx => {
        const to = getToAddress(tx);
        const amount = getAmount(tx);
        return {
          [TxTableColumns.Transaction]: {
            amount: microToStacksFormatted(amount),
            functionName:
              tx.tx_type === 'contract_call' ? tx.contract_call?.function_name : undefined,
            contractName:
              tx.tx_type === 'contract_call' ? tx.contract_call?.contract_id : undefined,
            txType: tx.tx_type,
            status: tx.tx_status,
          },
          [TxTableColumns.TxId]: tx.tx_id,
          [TxTableColumns.TxType]: tx.tx_type,
          [TxTableColumns.From]: tx.sender_address,
          [TxTableColumns.ArrowRight]: <ArrowRight />,
          [TxTableColumns.To]: to,
          [TxTableColumns.Fee]: tx.fee_rate,
          [TxTableColumns.Amount]: amount,
          [TxTableColumns.BlockTime]: tx.block_time,
        } as TxTableData;
      }),
    [txs]
  );

  return (
    <Table
      rowData={rowData}
      columnDefinitions={columnDefinitions}
      hasScrollIndicator
      tableContainerWrapper={table => (
        <TableContainer title={'Transactions'}>{table}</TableContainer>
      )}
    />
  );
}
