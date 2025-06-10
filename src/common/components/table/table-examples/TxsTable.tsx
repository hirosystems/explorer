'use client';

import { useSubscribeTxs } from '@/app/_components/BlockList/Sockets/useSubscribeTxs';
import { TxPageFilters } from '@/app/transactions/page';
import { CompressedTxTableData } from '@/app/transactions/utils';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import { useConfirmedTransactions } from '@/common/queries/useConfirmedTransactionsInfinite';
import { formatTimestamp } from '@/common/utils/time-utils';
import { microToStacksFormatted, validateStacksContractId } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Box, Table as ChakraTable, Flex, Icon } from '@chakra-ui/react';
import { ArrowRight, ArrowsClockwise } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Header, PaginationState } from '@tanstack/react-table';
import { type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { Table } from '../Table';
import { DefaultTableColumnHeader } from '../TableComponents';
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
import { TX_TABLE_PAGE_SIZE } from './consts';
import { TxTableColumns } from './types';

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

export const defaultColumnDefinitions: ColumnDef<TxTableData>[] = [
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
    cell: info => TxLinkCellRenderer(info.getValue() as string),
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
    size: 45,
    minSize: 45,
    maxSize: 45,
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
    header: ({ header }: { header: Header<TxTableData, unknown> }) => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        <DefaultTableColumnHeader header={header}>Fee</DefaultTableColumnHeader>
      </Flex>
    ),
    accessorKey: TxTableColumns.Fee,
    cell: info => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        {FeeCellRenderer(info.getValue() as string)}
      </Flex>
    ),
    enableSorting: false,
  },
  {
    id: TxTableColumns.BlockTime,
    header: ({ header }: { header: Header<TxTableData, unknown> }) => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        <DefaultTableColumnHeader header={header}>Timestamp</DefaultTableColumnHeader>
      </Flex>
    ),
    accessorKey: TxTableColumns.BlockTime,
    cell: info => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        {TimeStampCellRenderer(formatTimestamp(info.getValue() as number))}
      </Flex>
    ),
    enableSorting: false,
    meta: {
      tooltip: 'Timestamps are shown in your local timezone',
    },
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

export interface TxsTableProps {
  filters: TxPageFilters;
  initialData: GenericResponseType<CompressedTxTableData> | undefined;
  disablePagination?: boolean;
  columnDefinitions?: ColumnDef<TxTableData>[];
  pageSize?: number;
}

export function TxsTable({
  filters,
  initialData,
  disablePagination = false,
  columnDefinitions,
  pageSize = TX_TABLE_PAGE_SIZE,
}: TxsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const handlePageChange = useCallback((page: PaginationState) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: page.pageIndex,
    }));
    window?.scrollTo(0, 0); // Smooth scroll to top
  }, []);

  const queryClient = useQueryClient();

  const isCacheSetWithInitialData = useRef(false);

  const { fromAddress, toAddress, startTime, endTime, transactionType } = filters;
  /**
   * HACK: react query's cache is taking precedence over the initial data, which is causing hydration errors
   * Setting the gcTime to 0 prevents this from happening but it also prevents us from caching requests as the user paginates through the table
   * React query's initial data prop does not behave as expected. While it enables us to use the initial data for the first page, the initial data prop makes the logic required to replace initial data when it becomes stale difficult
   * By explicitly setting the cache for the first page with initial data, we guarantee the table will use the initial data from the server and behave as expected
   */
  if (isCacheSetWithInitialData.current === false && initialData) {
    const queryKey = [
      'confirmedTransactions',
      pagination.pageSize,
      pagination.pageIndex,
      ...(fromAddress ? [{ fromAddress }] : []),
      ...(toAddress ? [{ toAddress }] : []),
      ...(startTime ? [{ startTime }] : []),
      ...(endTime ? [{ endTime }] : []),
      ...(transactionType ? [{ transactionType }] : []),
    ];
    queryClient.setQueryData(queryKey, initialData);
    isCacheSetWithInitialData.current = true;
  }

  // fetch data
  let { data, refetch, isFetching } = useConfirmedTransactions(
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize,
    { ...filters },
    {
      staleTime: THIRTY_SECONDS,
      gcTime: THIRTY_SECONDS,
    }
  );

  // Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters]);

  const { total, results: txs = [] } = data || {};
  const isTableFiltered = Object.values(filters).some(v => v != null && v !== '');

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
    [txs]
  );

  return (
    <Table
      data={rowData}
      columns={columnDefinitions ?? defaultColumnDefinitions}
      tableContainerWrapper={table => <TableContainer minH="500px">{table}</TableContainer>}
      scrollIndicatorWrapper={table => <TableScrollIndicator>{table}</TableScrollIndicator>}
      pagination={
        disablePagination
          ? undefined
          : {
              manualPagination: true,
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              totalRows: total || 0,
              onPageChange: handlePageChange,
            }
      }
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
      isLoading={isFetching}
    />
  );
}
