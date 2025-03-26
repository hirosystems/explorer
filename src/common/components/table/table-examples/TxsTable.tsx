'use client';

import { useSubscribeTxs } from '@/app/_components/BlockList/Sockets/useSubscribeTxs';
import { TxPageFilters } from '@/app/transactions/page';
import { useConfirmedTransactions } from '@/common/queries/useConfirmedTransactionsInfinite';
import {
  microToStacksFormatted,
  truncateHex,
  validateStacksContractId,
} from '@/common/utils/utils';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { Text } from '@/ui/Text';
import { Box, Table as ChakraTable, Flex, Icon } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { ArrowRight, ArrowsClockwise } from '@phosphor-icons/react';
import { InfiniteData } from '@tanstack/react-query';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { type JSX, useCallback, useEffect, useMemo, useState } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { Table } from '../Table';
import { TableContainer } from '../TableContainer';
import { TableScrollIndicator } from '../TableScrollIndicatorWrapper';
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
  [TxTableColumns.From]: TxTableAddressColumnData;
  [TxTableColumns.ArrowRight]: JSX.Element;
  [TxTableColumns.To]: TxTableAddressColumnData;
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
  txId: string;
  blockHeight: number;
}

export interface TxTableAddressColumnData {
  address: string;
  isContract: boolean;
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
    return '';
  }
  return '';
}

export function getAmount(tx: Transaction): number {
  if (tx.tx_type === 'token_transfer') {
    return Number(tx.token_transfer?.amount);
  }
  return 0;
}

export const columns: ColumnDef<TxTableData>[] = [
  {
    id: TxTableColumns.Transaction,
    header: 'Transaction',
    accessorKey: TxTableColumns.Transaction,
    cell: info => TransactionTitleCellRenderer(info.getValue() as TxTableTransactionColumnData),
    enableSorting: false,
  },
  {
    id: TxTableColumns.TxId,
    header: 'ID',
    accessorKey: TxTableColumns.TxId,
    cell: info => TxLinkCellRenderer(truncateHex(info.getValue() as string, 4, 5, false)),
    enableSorting: false,
  },
  {
    id: TxTableColumns.TxType,
    header: 'Type',
    accessorKey: TxTableColumns.TxType,
    cell: info => <TxTypeCellRenderer txType={info.getValue() as string} />,
    enableSorting: false,
  },
  {
    id: TxTableColumns.From,
    header: 'From',
    accessorKey: TxTableColumns.From,
    cell: info => AddressLinkCellRenderer(info.getValue() as TxTableAddressColumnData),
    enableSorting: false,
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
    cell: info => AddressLinkCellRenderer(info.getValue() as TxTableAddressColumnData),
    enableSorting: false,
  },
  {
    id: TxTableColumns.Fee,
    header: 'Fee',
    accessorKey: TxTableColumns.Fee,
    cell: info => FeeCellRenderer(info.getValue() as string),
    enableSorting: false,
  },
  {
    id: TxTableColumns.BlockTime,
    header: 'Timestamp',
    accessorKey: TxTableColumns.BlockTime,
    cell: info => TimeStampCellRenderer(formatBlockTime(info.getValue() as number)),
    enableSorting: false,
  },
];

export const UpdateTableBannerRow = ({ onClick }: { onClick: () => void }) => {
  const numColumns = Object.keys(TxTableColumns).length;

  return (
    <ChakraTable.Row
      bg="transparent"
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
      onClick={onClick}
      cursor="pointer"
      className="group"
    >
      <ChakraTable.Cell colSpan={numColumns} py={2} px={1}>
        <Flex
          alignItems="center"
          justifyContent="center"
          gap={1.5}
          boxShadow="0px 4px 4px 0px rgba(252, 100, 50, 0.25), 0px 4px 4px 0px rgba(255, 85, 18, 0.25)"
          border="1px dashed var(--stacks-colors-accent-stacks-500)"
          borderRadius="redesign.lg"
          h={12}
        >
          <Box display="inline-flex">
            <Text fontSize="sm" fontWeight="medium" color="textSecondary">
              New transactions have come in.
            </Text>
            &nbsp;
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="textSecondary"
              _groupHover={{ color: 'textPrimary' }}
            >
              Update list
            </Text>
          </Box>
          <Icon h={3.5} w={3.5} color="iconTertiary" _groupHover={{ color: 'iconSecondary' }}>
            <ArrowsClockwise />
          </Icon>
        </Flex>
      </ChakraTable.Cell>
    </ChakraTable.Row>
  );
};

export function TxsTable({ filters }: { filters: TxPageFilters }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handlePageChange = useCallback((page: PaginationState) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: page.pageIndex,
    }));
  }, []);

  const { data, refetch } = useConfirmedTransactions(
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize,
    { ...filters },
    {
      placeholderData: (keepPreviousData: InfiniteData<unknown, unknown> | undefined) =>
        keepPreviousData,
    }
  );
  const { total, results: txs = [] } = data || {};
  const { activeFilters } = useFilterAndSortState();
  const filteredTxs = useMemo(
    () =>
      activeFilters.length === 0 ? txs : txs?.filter(tx => activeFilters.includes(tx.tx_type)),
    [txs, activeFilters]
  );

  const isTableFiltered = activeFilters.length > 0 || Object.keys(filters)?.length > 0;

  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [newTxsAvailable, setNewTxsAvailable] = useState(false);
  useSubscribeTxs(isSubscriptionActive, tx => {
    // Waiting 5 seconds to let the API catch up to the websocket
    setTimeout(() => {
      setNewTxsAvailable(true);
    }, 5000);
    setIsSubscriptionActive(false);
  });

  useEffect(() => {
    if (!newTxsAvailable) {
      setIsSubscriptionActive(true);
    }
  }, [newTxsAvailable]);

  const rowData: TxTableData[] = useMemo(
    () =>
      filteredTxs.map(tx => {
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
            txId: tx.tx_id,
            blockHeight: tx.block_height,
          },
          [TxTableColumns.TxId]: tx.tx_id,
          [TxTableColumns.TxType]: tx.tx_type,
          [TxTableColumns.From]: {
            address: tx.sender_address,
            isContract: validateStacksContractId(tx.sender_address),
          },
          [TxTableColumns.ArrowRight]: <ArrowRight />,
          [TxTableColumns.To]: {
            address: to,
            isContract: validateStacksContractId(to),
          },
          [TxTableColumns.Fee]: tx.fee_rate,
          [TxTableColumns.Amount]: amount,
          [TxTableColumns.BlockTime]: tx.block_time,
        };
      }),
    [filteredTxs]
  );

  // Because we don't want to show the loading state during pagination, we use this to get an initial load state
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    if (data) {
      setIsInitialLoad(false);
    }
  }, [data]);

  return (
    <Table
      data={rowData}
      columns={columns}
      isLoading={isInitialLoad}
      tableContainerWrapper={table => <TableContainer minH="500px">{table}</TableContainer>}
      scrollIndicatorWrapper={table => <TableScrollIndicator>{table}</TableScrollIndicator>}
      pagination={{
        manualPagination: true,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        totalRows: total || 0,
        onPageChange: handlePageChange,
      }}
      bannerRow={
        newTxsAvailable && pagination.pageIndex === 0 && !isTableFiltered ? (
          <UpdateTableBannerRow
            onClick={() => {
              setNewTxsAvailable(false);
              refetch();
            }}
          />
        ) : null
      }
    />
  );
}
