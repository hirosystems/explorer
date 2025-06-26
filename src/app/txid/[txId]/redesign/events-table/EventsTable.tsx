'use client';

import { Table } from '@/common/components/table/Table';
import { TableContainer } from '@/common/components/table/TableContainer';
import { TableScrollIndicator } from '@/common/components/table/TableScrollIndicatorWrapper';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import {
  TxEventsQueryFilters,
  getTxEventsByIdQueryKey,
  useTxEventsById,
} from '@/common/queries/useTxEventsById';
import { microToStacksFormatted, validateStacksContractId } from '@/common/utils/utils';
import { ArrowRight } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TransactionEvent, TransactionEventAssetType } from '@stacks/stacks-blockchain-api-types';

import {
  AddressLinkCellRenderer,
  AssetEventTypeCellRenderer,
  IndexCellRenderer,
} from './EventsTableCellRenderers';
import { EVENTS_TABLE_PAGE_SIZE } from './consts';
import { EventsTableColumns } from './types';
import {
  getAmount,
  getAsset,
  getAssetEventType,
  getAssetLabel,
  getEventType,
  getEventTypeLabel,
  getFromAddress,
  getToAddress,
} from './utils';

export interface EventsTableAddressColumnData {
  // TODO: shared with TxTable TxTableAddressColumnData
  address: string;
  isContract: boolean;
}

export interface EventsTableData {
  [EventsTableColumns.Index]: number;
  [EventsTableColumns.EventType]: TransactionEvent['event_type'];
  [EventsTableColumns.Asset]: string;
  [EventsTableColumns.AssetEventType]: TransactionEventAssetType;
  [EventsTableColumns.Amount]: string;
  [EventsTableColumns.From]: EventsTableAddressColumnData;
  [EventsTableColumns.ArrowRight]: JSX.Element;
  [EventsTableColumns.To]: EventsTableAddressColumnData;
}

export interface EventsTableEventColumnData {
  eventType: TransactionEvent['event_type'];
  asset: string;
  assetType: TransactionEventAssetType;
  amount: string;
  from: string;
  to: string;
}

export interface TxTableAddressColumnData {
  address: string;
  isContract: boolean;
}

export const defaultColumnDefinitions: ColumnDef<EventsTableData>[] = [
  {
    id: EventsTableColumns.Index,
    header: 'Index',
    accessorKey: EventsTableColumns.Index,
    cell: info => <IndexCellRenderer index={info.getValue() as number} />,
    enableSorting: false,
  },
  {
    id: EventsTableColumns.AssetEventType,
    header: 'Event',
    accessorKey: EventsTableColumns.AssetEventType,
    cell: info => (
      <AssetEventTypeCellRenderer assetEventType={info.getValue() as TransactionEventAssetType} />
    ),
    enableSorting: false,
  },
  {
    id: EventsTableColumns.Asset,
    header: 'Asset',
    accessorKey: EventsTableColumns.Asset,
    cell: info => getAssetLabel(info.getValue() as string),
    enableSorting: false,
  },
  {
    id: EventsTableColumns.EventType,
    header: 'Type',
    accessorKey: EventsTableColumns.EventType,
    cell: info => getEventTypeLabel(info.getValue() as TransactionEvent['event_type']),
    enableSorting: false,
  },
  {
    id: EventsTableColumns.Amount,
    header: 'Amount',
    accessorKey: EventsTableColumns.Amount,
    cell: info => info.getValue() as string,
    enableSorting: false,
  },
  {
    id: EventsTableColumns.From,
    header: 'From',
    accessorKey: EventsTableColumns.From,
    cell: info => AddressLinkCellRenderer(info.getValue() as EventsTableAddressColumnData),
    enableSorting: false,
  },
  {
    id: EventsTableColumns.ArrowRight,
    header: '',
    accessorKey: EventsTableColumns.ArrowRight,
    cell: info => info.getValue() as JSX.Element,
    enableSorting: false,
  },
  {
    id: EventsTableColumns.To,
    header: 'To',
    accessorKey: EventsTableColumns.To,
    cell: info => AddressLinkCellRenderer(info.getValue() as EventsTableAddressColumnData),
    enableSorting: false,
  },
];

export interface EventsTableProps {
  txId: string;
  initialData: GenericResponseType<EventsTableData> | undefined;
  disablePagination?: boolean;
  columnDefinitions?: ColumnDef<EventsTableData>[];
  pageSize?: number;
  filters?: TxEventsQueryFilters;
}

const DEFAULT_FILTERS: TxEventsQueryFilters = {
  address: '',
  type: [],
};

export function EventsTable({
  txId,
  filters = DEFAULT_FILTERS,
  initialData,
  disablePagination = false,
  columnDefinitions,
  pageSize = EVENTS_TABLE_PAGE_SIZE,
}: EventsTableProps) {
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
    const queryKey = getTxEventsByIdQueryKey(
      pagination.pageSize,
      pagination.pageIndex * pagination.pageSize,
      txId,
      { ...filters }
    );
    queryClient.setQueryData(queryKey, initialData);
    isCacheSetWithInitialData.current = true;
  }

  // fetch data
  let { data, isFetching, isLoading } = useTxEventsById(
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize,
    txId,
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

  const { total, results: events = [] } = data || {};
  const isTableFiltered = Object.values(filters).some(v => v != null && v !== '');

  const rowData: EventsTableData[] = useMemo(
    () =>
      events.map((event, index) => {
        const to = getToAddress(event);
        const from = getFromAddress(event);
        const amount = getAmount(event);
        const asset = getAsset(event);
        const assetEventType = getAssetEventType(event);
        const eventType = getEventType(event);
        console.log({ from, to });

        return {
          [EventsTableColumns.Index]: index + 1,
          [EventsTableColumns.AssetEventType]: assetEventType,
          [EventsTableColumns.Asset]: asset,
          [EventsTableColumns.EventType]: eventType,
          [EventsTableColumns.Amount]: microToStacksFormatted(amount),
          [EventsTableColumns.From]: {
            address: from,
            isContract: validateStacksContractId(from),
          },
          [EventsTableColumns.ArrowRight]: <ArrowRight />,
          [EventsTableColumns.To]: {
            address: to,
            isContract: validateStacksContractId(to),
          },
        };
      }),
    [events]
  );

  return (
    <Table
      data={rowData}
      columns={columnDefinitions ?? defaultColumnDefinitions}
      tableContainerWrapper={table => <TableContainer>{table}</TableContainer>}
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
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
}
