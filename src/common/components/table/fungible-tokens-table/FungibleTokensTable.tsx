'use client';

import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import { getAccountBalanceQueryKey } from '@/common/queries/useAccountBalance';
import { getFTMetadataQueryKey } from '@/common/queries/useFtMetadata';
import {
  calculateHoldingPercentage,
  deriveTokenTickerFromAssetId,
  formatHoldingPercentage,
  getTokenImageUrlFromTokenMetadata,
} from '@/common/utils/fungible-token-utils';
import { ftDecimals, getAssetNameParts } from '@/common/utils/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFilterAndSortState } from '../../../../features/txsFilterAndSort/useFilterAndSortState';
import { TokenLink } from '../../ExplorerLinks';
import { ScrollIndicator } from '../../ScrollIndicator';
import { EllipsisText } from '../CommonTableCellRenderers';
import { Table } from '../Table';
import { TableContainer } from '../TableContainer';
import { ADDRESS_ID_PAGE_FUNGIBLE_TOKENS_LIMIT } from '../table-examples/consts';
import { FungibleTokenCellRenderer } from './FungibleTokensTableCellRenderers';
import { useFungibleTokensTableData } from './useFungibleTokens';

export enum FungibleTokenTableColumns {
  Token = 'token',
  TokenId = 'tokenId',
  Balance = 'balance',
  Holding = 'holding',
}

export type FungibleTokenTableTokenColumnData = {
  name: string;
  ticker: string;
  tokenId: string;
  imageUrl: string | undefined;
};

export interface FungibleTokenTableData {
  [FungibleTokenTableColumns.Token]: FungibleTokenTableTokenColumnData;
  [FungibleTokenTableColumns.TokenId]: string;
  [FungibleTokenTableColumns.Balance]: string;
  [FungibleTokenTableColumns.Holding]: number | undefined;
}

export const defaultColumnDefinitions: ColumnDef<FungibleTokenTableData>[] = [
  {
    id: FungibleTokenTableColumns.Token,
    header: 'Token',
    accessorKey: FungibleTokenTableColumns.Token,
    cell: info => FungibleTokenCellRenderer(info.getValue() as FungibleTokenTableTokenColumnData),
    enableSorting: true,
  },
  {
    id: FungibleTokenTableColumns.TokenId,
    header: 'ID',
    accessorKey: FungibleTokenTableColumns.TokenId,
    cell: info => (
      <TokenLink tokenId={info.getValue() as string} variant="tableLink">
        <EllipsisText
          textStyle="text-regular-sm"
          color="textPrimary"
          _hover={{
            color: 'textInteractiveHover',
          }}
          fontFamily="var(--font-matter-mono)"
        >
          {info.getValue() as string}
        </EllipsisText>
      </TokenLink>
    ),
    enableSorting: false,
  },
  {
    id: FungibleTokenTableColumns.Balance,
    header: 'Balance',
    accessorKey: FungibleTokenTableColumns.Balance,
    cell: info => <EllipsisText fontSize="sm">{info.getValue() as string}</EllipsisText>,
    enableSorting: true,
  },
  {
    id: FungibleTokenTableColumns.Holding,
    header: 'Holding',
    accessorKey: FungibleTokenTableColumns.Holding,
    cell: info => <EllipsisText fontSize="sm">{formatHoldingPercentage(info.getValue() as number | undefined)}</EllipsisText>,
    enableSorting: true,
  },
];

export interface FungibleTokensTableProps {
  principal: string;
  initialData?: GenericResponseType<FungibleTokenTableData> | undefined;
  disablePagination?: boolean;
  columnDefinitions?: ColumnDef<FungibleTokenTableData>[];
  pageSize?: number;
  filters?: FungibleTokenTableFilters;
  onTotalChange?: (total: number) => void;
}

export type FungibleTokenTableFilters = {
  searchTerm: string;
  hideSuspiciousTokens: boolean;
};

const DEFAULT_FILTERS: FungibleTokenTableFilters = {
  searchTerm: '',
  hideSuspiciousTokens: false,
};



export function FungibleTokensTable({
  principal,
  filters = DEFAULT_FILTERS,
  initialData,
  disablePagination = false,
  columnDefinitions,
  pageSize = ADDRESS_ID_PAGE_FUNGIBLE_TOKENS_LIMIT,
}: FungibleTokensTableProps) {
  const { activeConfirmedTxsSort, activeConfirmedTxsOrder } = useFilterAndSortState();



  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const [sortColumn, setSortColumn] = useState<string | undefined>(FungibleTokenTableColumns.Balance);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>('desc');
  const onSort = useCallback((sort: SortingState) => {
    setSortColumn(sort[0]?.id);
    setSortDirection(sort[0]?.desc ? 'desc' : 'asc');
  }, []);
  useEffect(() => {
    console.log({sortColumn, sortDirection});
  }, [sortColumn, sortDirection]);

  // Sorting is now handled automatically by the Table component via sorting state
  const handlePageChange = useCallback((page: PaginationState) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: page.pageIndex,
    }));
    window?.scrollTo(0, 0); // Smooth scroll to top
  }, []);

  const queryClient = useQueryClient();

  const isCacheSetWithInitialData = useRef(false);

  const { searchTerm, hideSuspiciousTokens } = filters;

  /**
   * HACK: react query's cache is taking precedence over the initial data, which is causing hydration errors
   * Setting the gcTime to 0 prevents this from happening but it also prevents us from caching requests as the user paginates through the table
   * React query's initial data prop does not behave as expected. While it enables us to use the initial data for the first page, the initial data prop makes the logic required to replace initial data when it becomes stale difficult
   * By explicitly setting the cache for the first page with initial data, we guarantee the table will use the initial data from the server and behave as expected
   */
  if (isCacheSetWithInitialData.current === false && initialData) {
    // TODO: the inital data has to contain the ft balance data and the ft metadata data
    const accountBalanceQueryKey = getAccountBalanceQueryKey(principal);
    queryClient.setQueryData(accountBalanceQueryKey, initialData);
    // TODO: you'd have to do this for every ft
    const fungibleTokensQueryKey = getFTMetadataQueryKey(principal);
    queryClient.setQueryData(fungibleTokensQueryKey, initialData);
    isCacheSetWithInitialData.current = true;
  }

  // fetch data
  let {
    data: fungibleTokenData,
    isFetching,
    isLoading,
    total,
  } = useFungibleTokensTableData(
    principal,
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize,
    searchTerm,
    hideSuspiciousTokens,
    sortColumn,
    sortDirection,
    {
      staleTime: THIRTY_SECONDS,
      gcTime: THIRTY_SECONDS,
    }
  );

  console.log('FungibleTokensTable', { isLoading, isFetching, fungibleTokenData });

  const rowData: FungibleTokenTableData[] = useMemo(() => {
    if (isLoading || isFetching) return [];
    return (
      fungibleTokenData?.map(ft => {
        const tokenAssetId = 'asset_identifier' in ft ? (ft.asset_identifier as string) : '';
        const { address, contract, asset } = getAssetNameParts(tokenAssetId);
        const tokenId = `${address}.${contract}`;
        const holding = calculateHoldingPercentage(ft.balance, ft.total_supply);
        const ticker = ft.symbol || deriveTokenTickerFromAssetId(tokenAssetId);
        const name = ft.name || asset;
        const imageUrl = ft.metadata ? getTokenImageUrlFromTokenMetadata(ft.metadata) : undefined;
        const balance = ftDecimals(ft?.balance, ft?.decimals || 0);

        return {
          [FungibleTokenTableColumns.Token]: {
            name,
            ticker,
            tokenId,
            imageUrl,
          },
          [FungibleTokenTableColumns.TokenId]: tokenId,
          [FungibleTokenTableColumns.Balance]: balance,
          [FungibleTokenTableColumns.Holding]: holding,
        };
      }) || []
    );
  }, [fungibleTokenData, isLoading, isFetching]);

  console.log('FungibleTokensTable', { rowData, total });

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
              totalRows: total,
              onPageChange: handlePageChange,
            }
      }
      isLoading={isLoading}
      isFetching={isFetching}
      onSort={onSort}
    />
  );
}
