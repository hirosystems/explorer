'use client';

import { Box, Flex } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerErrorBoundary } from '../../app/_components/ErrorBoundary';
import { ListFooter } from '../../common/components/ListFooter';
import { useInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useMempoolTransactionsInfinite } from '../../common/queries/useMempoolTransactionsInfinite';
import { Text } from '../../ui/Text';
import { FilterButton } from '../txsFilterAndSort/FilterButton';
import { ShowValueMenu } from '../txsFilterAndSort/ShowValueMenu';
import { MempoolTxsSortMenu } from '../txsFilterAndSort/SortMenu';
import { useFilterAndSortState } from '../txsFilterAndSort/useFilterAndSortState';
import { FilteredTxs } from './FilteredTxs';
import { MempoolTxListItem } from './ListItem/MempoolTxListItem';
import { SkeletonTxsList } from './SkeletonTxsList';

interface MempoolTxsListProps {
  limit?: number;
  showValueMenu?: boolean;
  showFilterButton?: boolean;
}

function MempoolTxsListBase({
  limit,
  showValueMenu = true,
  showFilterButton = true,
}: MempoolTxsListProps) {
  const { activeMempoolTxsSort, activeMempoolTxsOrder } = useFilterAndSortState();
  const response = useMempoolTransactionsInfinite(activeMempoolTxsSort, activeMempoolTxsOrder);
  const txs = useInfiniteQueryResult<MempoolTransaction>(response, limit);
  const isHomePage = usePathname() === '/';

  if (response.isLoading || response.isFetching) return <SkeletonTxsList />;

  if (!txs?.length) {
    return (
      <Flex py={12} justifyContent={'center'}>
        <Text fontSize={'sm'}>No pending transactions</Text>
      </Flex>
    );
  }
  return (
    <Box pb={6}>
      {(!isHomePage || showValueMenu || showFilterButton) && (
        <Flex pt={4.5} pb={4} gap={2} flexWrap={'wrap'}>
          {!isHomePage && <MempoolTxsSortMenu />}
          {showValueMenu && <ShowValueMenu />}
          {showFilterButton && <FilterButton />}
        </Flex>
      )}
      <FilteredTxs txs={txs} TxListItem={MempoolTxListItem} />
      <ListFooter
        isLoading={response.isFetchingNextPage}
        hasNextPage={response.hasNextPage}
        href={limit ? '/transactions' : undefined}
        fetchNextPage={limit ? undefined : response.fetchNextPage}
        label={'transactions'}
      />
    </Box>
  );
}

export function MempoolTxsList(props: MempoolTxsListProps) {
  return (
    <ExplorerErrorBoundary Wrapper={Box} wrapperProps={{ px: '20px' }} tryAgainButton>
      <MempoolTxsListBase {...props} />
    </ExplorerErrorBoundary>
  );
}
