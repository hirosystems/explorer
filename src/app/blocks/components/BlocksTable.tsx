'use client';

import { ScrollIndicator } from '@/common/components/ScrollIndicator';
import { Table } from '@/common/components/table/Table';
import { TableContainer } from '@/common/components/table/TableContainer';
import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import { useBurnBlocksInfinite } from '@/common/queries/useBurnBlocksInfinite';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import BitcoinIcon from '@/ui/icons/BitcoinIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useRef, useState } from 'react';

import { UpdateTableBannerRow } from '../../../common/components/table/UpdateTableBannerRow';
import { useSubscribeBlocks } from '../../_components/BlockList/Sockets/useSubscribeBlocks';
import { useBlocksData } from '../context';
import { useBlocksV2Infinite } from '../queries/useBlocksV2Queries';
import { bitcoinBlockColumns } from './columns/bitcoinBlockColumns';
import { stacksBlockColumns } from './columns/stacksBlockColumns';
import { useBitcoinTableData, useStacksTableData } from './hooks/useBlocksTableData';

type BlockViewType = 'bitcoin' | 'stacks';

const BLOCKS_TABLE_PAGE_SIZE = 30;

function BitcoinBlocksTable({ isActive }: { isActive: boolean }) {
  const { initialBtcBlocksData } = useBlocksData();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: BLOCKS_TABLE_PAGE_SIZE,
  });

  const queryClient = useQueryClient();
  const isCacheSetWithInitialData = useRef(false);

  /**
   * HACK: react query's cache is taking precedence over the initial data, which is causing hydration errors
   * Setting the gcTime to 0 prevents this from happening but it also prevents us from caching requests as the user paginates through the table
   * React query's initial data prop does not behave as expected. While it enables us to use the initial data for the first page, the initial data prop makes the logic required to replace initial data when it becomes stale difficult
   * By explicitly setting the cache for the first page with initial data, we guarantee the table will use the initial data from the server and behave as expected
   */
  if (isCacheSetWithInitialData.current === false && initialBtcBlocksData) {
    const queryKey = ['burnBlocks', BLOCKS_TABLE_PAGE_SIZE];
    const infiniteData = {
      pages: [initialBtcBlocksData.btcBlocks],
      pageParams: [0],
    };
    queryClient.setQueryData(queryKey, infiniteData);
    isCacheSetWithInitialData.current = true;
  }

  const btcBlocksQuery = useBurnBlocksInfinite(BLOCKS_TABLE_PAGE_SIZE, {
    staleTime: THIRTY_SECONDS,
    gcTime: THIRTY_SECONDS,
    enabled: isActive,
  });

  const handlePageChange = useCallback(
    (page: PaginationState) => {
      const newPageIndex = page.pageIndex;
      setPagination(prev => ({ ...prev, pageIndex: newPageIndex }));

      const currentPages = btcBlocksQuery.data?.pages.length || 0;
      if (
        newPageIndex >= currentPages - 1 &&
        btcBlocksQuery.hasNextPage &&
        !btcBlocksQuery.isFetching
      ) {
        btcBlocksQuery.fetchNextPage();
      }

      window?.scrollTo(0, 0);
    },
    [btcBlocksQuery]
  );

  const bitcoinTableData = useBitcoinTableData(btcBlocksQuery, pagination);
  const isLoading =
    (btcBlocksQuery.isLoading || btcBlocksQuery.isFetching) && bitcoinTableData.length === 0;

  return (
    <Table
      data={bitcoinTableData}
      columns={bitcoinBlockColumns}
      pagination={{
        manualPagination: true,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        totalRows:
          btcBlocksQuery.data?.pages[0]?.total || initialBtcBlocksData?.btcBlocks?.total || 0,
        onPageChange: handlePageChange,
      }}
      isLoading={isLoading}
      isFetching={btcBlocksQuery.isFetching}
      bannerRow={null}
      tableContainerWrapper={table => (
        <TableContainer minH="500px" pt={{ base: 3, lg: 4 }}>
          {table}
        </TableContainer>
      )}
      scrollIndicatorWrapper={table => <ScrollIndicator>{table}</ScrollIndicator>}
      tableProps={{ mt: { base: -3, lg: -4 } }}
    />
  );
}

function StacksBlocksTable({ isActive }: { isActive: boolean }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: BLOCKS_TABLE_PAGE_SIZE,
  });
  const [isStxSubscriptionActive, setIsStxSubscriptionActive] = useState(false);
  const [newStxBlocksAvailable, setNewStxBlocksAvailable] = useState(false);

  const stxBlocksQuery = useBlocksV2Infinite(BLOCKS_TABLE_PAGE_SIZE, {
    staleTime: THIRTY_SECONDS,
    gcTime: THIRTY_SECONDS,
    enabled: isActive,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useSubscribeBlocks(isStxSubscriptionActive, block => {
    setTimeout(() => {
      setNewStxBlocksAvailable(true);
    }, 5000);
    setIsStxSubscriptionActive(false);
  });

  useEffect(() => {
    if (!newStxBlocksAvailable && isActive) {
      setIsStxSubscriptionActive(true);
    }
  }, [newStxBlocksAvailable, isActive]);

  const handlePageChange = useCallback(
    (page: PaginationState) => {
      const newPageIndex = page.pageIndex;
      setPagination(prev => ({ ...prev, pageIndex: newPageIndex }));

      const currentPages = stxBlocksQuery.data?.pages.length || 0;
      if (
        newPageIndex >= currentPages - 1 &&
        stxBlocksQuery.hasNextPage &&
        !stxBlocksQuery.isFetching
      ) {
        stxBlocksQuery.fetchNextPage();
      }

      window?.scrollTo(0, 0);
    },
    [stxBlocksQuery]
  );

  const handleUpdateStx = useCallback(() => {
    setNewStxBlocksAvailable(false);
    stxBlocksQuery.refetch();
  }, [stxBlocksQuery]);

  const stacksTableData = useStacksTableData(stxBlocksQuery, pagination);
  const isLoading =
    (stxBlocksQuery.isLoading || stxBlocksQuery.isFetching) && stacksTableData.length === 0;

  return (
    <Table
      data={stacksTableData}
      columns={stacksBlockColumns}
      pagination={{
        manualPagination: true,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        totalRows: stxBlocksQuery.data?.pages[0]?.total || 0,
        onPageChange: handlePageChange,
      }}
      isLoading={isLoading}
      isFetching={stxBlocksQuery.isFetching}
      bannerRow={
        newStxBlocksAvailable && pagination.pageIndex === 0 ? (
          <UpdateTableBannerRow
            onClick={handleUpdateStx}
            colSpan={stacksBlockColumns.length}
            message="New Stacks blocks have been mined. Update list"
          />
        ) : null
      }
      tableContainerWrapper={table => (
        <TableContainer minH="500px" pt={{ base: 3, lg: 4 }}>
          {table}
        </TableContainer>
      )}
      scrollIndicatorWrapper={table => <ScrollIndicator>{table}</ScrollIndicator>}
      tableProps={{ mt: { base: -3, lg: -4 } }}
    />
  );
}

export function BlocksTable() {
  const [activeView, setActiveView] = useState<BlockViewType>('bitcoin');

  const handleViewChange = useCallback((view: BlockViewType) => {
    setActiveView(view);
  }, []);

  return (
    <TabsRoot
      variant="primary"
      size="redesignMd"
      value={activeView}
      onValueChange={details => handleViewChange(details.value as BlockViewType)}
    >
      <Flex align="center" gap={3} mb={4}>
        <Text textStyle="text-regular-sm" color="textSecondary">
          View by:
        </Text>
        <TabsList>
          <TabsTrigger value="bitcoin">
            <Flex align="center" gap={1.5}>
              <Icon w={4} h={4} color={activeView === 'bitcoin' ? 'textPrimary' : 'textSecondary'}>
                <BitcoinIcon />
              </Icon>
              Bitcoin block
            </Flex>
          </TabsTrigger>
          <TabsTrigger value="stacks">
            <Flex align="center" gap={1.5}>
              <Icon w={4} h={4} color={activeView === 'stacks' ? 'textPrimary' : 'textSecondary'}>
                <StxIcon />
              </Icon>
              Stacks block
            </Flex>
          </TabsTrigger>
        </TabsList>
      </Flex>

      <TabsContent value="bitcoin">
        <BitcoinBlocksTable isActive={activeView === 'bitcoin'} />
      </TabsContent>

      <TabsContent value="stacks">
        <StacksBlocksTable isActive={activeView === 'stacks'} />
      </TabsContent>
    </TabsRoot>
  );
}
