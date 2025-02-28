'use client';

import { useInfiniteQueryResult } from '@/common/hooks/useInfiniteQueryResult';
import { useConfirmedTransactionsInfinite } from '@/common/queries/useConfirmedTransactionsInfinite';
import {
  microToStacksFormatted,
  truncateMiddle,
  validateStacksAddress,
} from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Table as ChakraTable, Flex, Icon } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { ArrowRight, ArrowsClockwise } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { Table } from '../Table';
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
  Fee = 'fee',
  Amount = 'amount',
  BlockTime = 'blockTime',
}

export interface TxTableData {
  [TxTableColumns.Transaction]: TxTableTransactionColumnData;
  [TxTableColumns.TxId]: string;
  [TxTableColumns.TxType]: Transaction['tx_type'];
  [TxTableColumns.From]: string;
  [TxTableColumns.ArrowRight]: JSX.Element;
  [TxTableColumns.To]: string;
  [TxTableColumns.Fee]: string;
  [TxTableColumns.Amount]: number;
  [TxTableColumns.BlockTime]: number;
}

export interface TxTableTransactionColumnData {
  amount?: string;
  functionName?: string;
  contractName?: string;
  txType?: Transaction['tx_type'];
  status?: Transaction['tx_status'];
  tenureChangePayload?: {
    cause?: string;
  };
  smartContract?: {
    contractId?: string;
  };
}

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
  if (tx.tx_type === 'tenure_change') {
    return '-';
  }
  return '';
}

export function getAmount(tx: Transaction): number {
  if (tx.tx_type === 'token_transfer') {
    return Number(tx.token_transfer?.amount);
  }
  return 0;
}

const transactionColumnSortingFn = (
  rowA: { getValue: (columnId: string) => unknown },
  rowB: { getValue: (columnId: string) => unknown },
  columnId: string
) => {
  const dataA = rowA.getValue(columnId) as TxTableTransactionColumnData;
  const dataB = rowB.getValue(columnId) as TxTableTransactionColumnData;

  // For contract calls, sort by function name then contract name
  if (dataA.txType === 'contract_call' && dataB.txType === 'contract_call') {
    // First compare by function name
    if (dataA.functionName && dataB.functionName) {
      const functionNameComparison = dataA.functionName.localeCompare(dataB.functionName);
      if (functionNameComparison !== 0) return functionNameComparison;
    } else if (dataA.functionName) {
      return -1;
    } else if (dataB.functionName) {
      return 1;
    }

    // If function names are equal or both undefined, compare by contract name
    if (dataA.contractName && dataB.contractName) {
      return dataA.contractName.localeCompare(dataB.contractName);
    } else if (dataA.contractName) {
      return -1;
    } else if (dataB.contractName) {
      return 1;
    }
  }

  // For token transfers and coinbase, sort by amount
  if (
    (dataA.txType === 'token_transfer' || dataA.txType === 'coinbase') &&
    (dataB.txType === 'token_transfer' || dataB.txType === 'coinbase')
  ) {
    const amountA = parseFloat(dataA.amount || '0');
    const amountB = parseFloat(dataB.amount || '0');
    return amountA - amountB;
  }

  // If different types, sort by type
  if (dataA.txType && dataB.txType && dataA.txType !== dataB.txType) {
    return dataA.txType.localeCompare(dataB.txType);
  }

  return 0;
};

export const columns: ColumnDef<TxTableData>[] = [
  {
    id: TxTableColumns.Transaction,
    header: 'Transaction',
    accessorKey: TxTableColumns.Transaction,
    cell: info => TransactionTitleCellRenderer(info.getValue() as TxTableTransactionColumnData),
    sortingFn: transactionColumnSortingFn,
  },
  {
    id: TxTableColumns.TxId,
    header: 'ID',
    accessorKey: TxTableColumns.TxId,
    cell: info => TxLinkCellRenderer(truncateMiddle(info.getValue() as string)),
  },
  {
    id: TxTableColumns.TxType,
    header: 'Tx Type',
    accessorKey: TxTableColumns.TxType,
    cell: ({ getValue }) => <TxTypeCellRenderer txType={getValue() as string} />,
  },
  {
    id: TxTableColumns.From,
    header: 'From',
    accessorKey: TxTableColumns.From,
    cell: info => AddressLinkCellRenderer(truncateMiddle(info.getValue() as string)),
  },
  {
    id: TxTableColumns.ArrowRight,
    header: '',
    accessorKey: TxTableColumns.ArrowRight,
    cell: info => IconCellRenderer(info.getValue() as JSX.Element),
    enableSorting: false,
  },
  {
    id: TxTableColumns.To,
    header: 'To',
    accessorKey: TxTableColumns.To,
    cell: info =>
      AddressLinkCellRenderer(
        validateStacksAddress(info.getValue() as string)
          ? truncateMiddle(info.getValue() as string)
          : (info.getValue() as string)
      ),
  },
  {
    id: TxTableColumns.Fee,
    header: 'Fee',
    accessorKey: TxTableColumns.Fee,
    cell: info => FeeCellRenderer(microToStacksFormatted(info.getValue() as string)),
  },
  {
    id: TxTableColumns.BlockTime,
    header: 'Block Time',
    accessorKey: TxTableColumns.BlockTime,
    cell: info => TimeStampCellRenderer(formatBlockTime(info.getValue() as number)),
  },
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
            smartContract: {
              contractId:
                tx.tx_type === 'smart_contract' ? tx.smart_contract?.contract_id : undefined,
            },
            tenureChangePayload: {
              cause: tx.tx_type === 'tenure_change' ? tx.tenure_change_payload?.cause : undefined,
            },
          },
          [TxTableColumns.TxId]: tx.tx_id,
          [TxTableColumns.TxType]: tx.tx_type,
          [TxTableColumns.From]: tx.sender_address,
          [TxTableColumns.ArrowRight]: <ArrowRight />,
          [TxTableColumns.To]: to,
          [TxTableColumns.Fee]: tx.fee_rate,
          [TxTableColumns.Amount]: amount,
          [TxTableColumns.BlockTime]: tx.block_time,
        };
      }),
    [txs]
  );

  return (
    <Table
      data={rowData}
      columns={columns}
      tableContainerWrapper={table => <TableContainer>{table}</TableContainer>}
      isLoading={response.isLoading}
    />
  );
}
