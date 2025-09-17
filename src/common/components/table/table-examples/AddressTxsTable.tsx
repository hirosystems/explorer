'use client';

import { CompressedTxAndMempoolTxTableData } from '@/app/transactions/utils';
import { TxTableAddressColumnData } from '@/common/components/table/table-examples/TxsTable';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import {
  getAddressTxsQueryKey,
  useAddressTxs,
} from '@/common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { formatTimestamp, formatTimestampToRelativeTime } from '@/common/utils/time-utils';
import { getAmount, getToAddress, isConfirmedTx } from '@/common/utils/transaction-utils';
import { validateStacksContractId } from '@/common/utils/utils';
import { Flex, Icon } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Header, PaginationState } from '@tanstack/react-table';
import { type JSX, useCallback, useMemo, useRef, useState } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { ScrollIndicator } from '../../ScrollIndicator';
import { AddressLinkCellRenderer } from '../CommonTableCellRenderers';
import { Table } from '../Table';
import { DefaultTableColumnHeader } from '../TableComponents';
import { TableContainer } from '../TableContainer';
import {
  FeeCellRenderer,
  IconCellRenderer,
  TimeStampCellRenderer,
  TransactionTitleCellRenderer,
  TxLinkCellRenderer,
  TxTypeCellRenderer,
} from './TxTableCellRenderers';
import { ADDRESS_ID_PAGE_ADDRESS_TXS_LIMIT } from './consts';
import { TxTableColumns } from './types';

export interface TxTableData {
  [TxTableColumns.Transaction]: Transaction | MempoolTransaction;
  [TxTableColumns.TxId]: string;
  [TxTableColumns.TxType]: Transaction['tx_type'];
  [TxTableColumns.From]: TxTableAddressColumnData;
  [TxTableColumns.ArrowRight]: JSX.Element;
  [TxTableColumns.To]: TxTableAddressColumnData;
  [TxTableColumns.Fee]: string;
  [TxTableColumns.Amount]: number;
  [TxTableColumns.BlockTime]: number | undefined;
}

export const defaultColumnDefinitions: ColumnDef<TxTableData>[] = [
  {
    id: TxTableColumns.Transaction,
    header: 'Transaction',
    accessorKey: TxTableColumns.Transaction,
    cell: info => TransactionTitleCellRenderer(info.getValue() as Transaction | MempoolTransaction),
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
        {TimeStampCellRenderer(
          formatTimestampToRelativeTime(info.getValue() as number),
          formatTimestamp(info.getValue() as number, 'HH:mm:ss', true)
        )}
      </Flex>
    ),
    enableSorting: false,
    meta: {
      tooltip: 'Timestamps are shown in your local timezone',
    },
  },
];

export interface TxsTableProps {
  principal: string;
  initialData?: GenericResponseType<CompressedTxAndMempoolTxTableData> | undefined;
  disablePagination?: boolean;
  columnDefinitions?: ColumnDef<TxTableData>[];
  pageSize: number;
  onTotalChange?: (total: number) => void;
}

export function AddressTxsTable({
  principal,
  initialData,
  disablePagination = false,
  columnDefinitions,
  pageSize,
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
  /**
   * HACK: react query's cache is taking precedence over the initial data, which is causing hydration errors
   * Setting the gcTime to 0 prevents this from happening but it also prevents us from caching requests as the user paginates through the table
   * React query's initial data prop does not behave as expected. While it enables us to use the initial data for the first page, the initial data prop makes the logic required to replace initial data when it becomes stale difficult
   * By explicitly setting the cache for the first page with initial data, we guarantee the table will use the initial data from the server and behave as expected
   */
  if (isCacheSetWithInitialData.current === false && initialData) {
    console.log('setting cache', {
      queryKey: getAddressTxsQueryKey(
        principal,
        pagination.pageSize,
        pagination.pageIndex * pagination.pageSize
      ),
    });
    const queryKey = getAddressTxsQueryKey(
      principal,
      pagination.pageSize,
      pagination.pageIndex * pagination.pageSize
    );
    queryClient.setQueryData(queryKey, initialData);
    isCacheSetWithInitialData.current = true;
  }

  // fetch data
  let { data, isFetching, isLoading } = useAddressTxs(
    principal,
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize,
    {
      staleTime: THIRTY_SECONDS,
      gcTime: THIRTY_SECONDS,
    }
  );

  const { total, results: txs = [] } = data || {};

  const rowData: TxTableData[] = useMemo(
    () =>
      txs.map(tx => {
        const isConfirmed = isConfirmedTx<Transaction, MempoolTransaction>(tx);
        const to = getToAddress(tx);
        const amount = getAmount(tx);

        return {
          [TxTableColumns.Transaction]: tx,
          [TxTableColumns.TxId]: tx.tx_id,
          [TxTableColumns.TxType]: tx.tx_type,
          [TxTableColumns.From]: {
            address: tx.sender_address,
            isContract: validateStacksContractId(tx.sender_address),
          },
          [TxTableColumns.ArrowRight]: (
            <Icon color="iconTertiary">
              <ArrowRight />
            </Icon>
          ),
          [TxTableColumns.To]: {
            address: to,
            isContract: validateStacksContractId(to),
          },
          [TxTableColumns.Fee]: tx.fee_rate,
          [TxTableColumns.Amount]: amount,
          [TxTableColumns.BlockTime]: isConfirmed ? tx.block_time : undefined,
        };
      }),
    [txs]
  );

  return (
    <Table
      data={rowData}
      columns={columnDefinitions ?? defaultColumnDefinitions}
      tableContainerWrapper={table => <TableContainer>{table}</TableContainer>}
      scrollIndicatorWrapper={table => <ScrollIndicator>{table}</ScrollIndicator>}
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
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
}
