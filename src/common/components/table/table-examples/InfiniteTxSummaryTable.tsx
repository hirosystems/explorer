'use client';

import { useSubscribeTxs } from '@/app/_components/BlockList/Sockets/useSubscribeTxs';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { ColumnDef } from '@tanstack/react-table';
import { type JSX, useEffect, useMemo, useRef, useState } from 'react';

import { ListFooter } from '../../ListFooter';
import { ScrollIndicator } from '../../ScrollIndicator';
import { Table } from '../Table';
import { UpdateTableBannerRow } from '../UpdateTableBannerRow';

export interface InfiniteTxSummaryTableProps<TSummary, TRow> {
  txs: TSummary[];
  columns: ColumnDef<TRow>[];
  mapRow: (tx: TSummary) => TRow;
  /** Client-side type filter key for a summary (v3 list endpoints can't filter server-side). */
  getType: (tx: TSummary) => string;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  tableContainer?: (table: JSX.Element) => JSX.Element;
  label?: string;
  /** Extra side effects to run when the "new transactions" banner is clicked. */
  onRefresh?: () => void;
}

/**
 * Columnar table over a cursor-paginated v3 summary feed. Pages are appended via a "Load more"
 * footer (cursor pagination can't jump to arbitrary pages), and the type filter is applied
 * client-side over the already-fetched rows since v3 list endpoints only accept `limit` + `cursor`.
 */
export function InfiniteTxSummaryTable<TSummary, TRow>({
  txs,
  columns,
  mapRow,
  getType,
  isLoading,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  refetch,
  tableContainer,
  label = 'transactions',
  onRefresh,
}: InfiniteTxSummaryTableProps<TSummary, TRow>) {
  const { activeFilters } = useFilterAndSortState();

  const filteredTxs = useMemo(
    () =>
      activeFilters.length === 0 ? txs : txs.filter(tx => activeFilters.includes(getType(tx))),
    [txs, activeFilters, getType]
  );

  const rowData = useMemo(() => filteredTxs.map(mapRow), [filteredTxs, mapRow]);

  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [newTxsAvailable, setNewTxsAvailable] = useState(false);
  const newTxsTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useSubscribeTxs(isSubscriptionActive, () => {
    // Wait 5 seconds to let the API catch up to the websocket before offering a refresh.
    if (newTxsTimer.current) return;
    newTxsTimer.current = setTimeout(() => {
      setNewTxsAvailable(true);
      newTxsTimer.current = undefined;
    }, 5000);
    setIsSubscriptionActive(false);
  });
  useEffect(() => {
    if (!newTxsAvailable) setIsSubscriptionActive(true);
  }, [newTxsAvailable]);
  useEffect(() => () => clearTimeout(newTxsTimer.current), []);

  const isFiltered = activeFilters.length > 0;

  return (
    <>
      <Table
        data={rowData}
        columns={columns}
        tableContainerWrapper={tableContainer ? table => tableContainer(table) : undefined}
        scrollIndicatorWrapper={table => <ScrollIndicator>{table}</ScrollIndicator>}
        bannerRow={
          newTxsAvailable && !isFiltered ? (
            <UpdateTableBannerRow
              onClick={() => {
                setNewTxsAvailable(false);
                refetch();
                onRefresh?.();
              }}
              colSpan={columns.length}
              message="New transactions have come in. Update list"
            />
          ) : null
        }
        isLoading={isLoading}
        isFetching={isFetching && !isFetchingNextPage}
      />
      <ListFooter
        isLoading={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        label={label}
      />
    </>
  );
}
