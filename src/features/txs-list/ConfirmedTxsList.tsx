import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerErrorBoundary } from '../../app/_components/ErrorBoundary';
import { ClearFiltersButton } from '../../app/search/filters';
import { AddressFilter } from '../../app/search/filters/Address';
import { DateFilter } from '../../app/search/filters/Date';
import { ListFooter } from '../../common/components/ListFooter';
import { useInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useConfirmedTransactionsInfinite } from '../../common/queries/useConfirmedTransactionsInfinite';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { NoTxs } from '../search/NoTxs';
import { FilterButton } from '../txsFilterAndSort/FilterButton';
import { ShowValueMenu } from '../txsFilterAndSort/ShowValueMenu';
import { FilteredTxs } from './FilteredTxs';
import { TxListItem } from './ListItem/TxListItem';
import { SkeletonTxsList } from './SkeletonTxsList';

interface ConfirmedTxsListProps {
  limit?: number;
  showValueMenu?: boolean;
  showFilterButton?: boolean;
  filters?: Record<string, string | undefined>;
}

function ConfirmedTxsListBase({
  limit,
  filters,
  showValueMenu = true,
  showFilterButton = true,
}: ConfirmedTxsListProps) {
  const response = useConfirmedTransactionsInfinite(filters);
  const txs = useInfiniteQueryResult<Transaction>(response, limit);

  if (response.isLoading || response.isFetching) return <SkeletonTxsList />;

  return (
    <Box pb={6}>
      {!!filters && (
        <Flex borderBottom={'1px'} pb={4.5} gap={4} flexWrap={'wrap'}>
          <Flex gap={2} flexWrap={'wrap'}>
            <AddressFilter
              defaultFromAddress={filters.fromAddress}
              defaultToAddress={filters.toAddress}
            />
            <DateFilter defaultStartTime={filters.startTime} defaultEndTime={filters.endTime} />
          </Flex>
          <ClearFiltersButton filters={filters} />
        </Flex>
      )}
      {(showValueMenu || showFilterButton) && (
        <Flex pt={4.5} pb={4} gap={2} flexWrap={'wrap'}>
          {showValueMenu && <ShowValueMenu />}
          {showFilterButton && <FilterButton />}
        </Flex>
      )}
      {!txs?.length ? <NoTxs /> : <FilteredTxs txs={txs} TxListItem={TxListItem} />}
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

export function ConfirmedTxsList(props: ConfirmedTxsListProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Flex}
      wrapperProps={{ px: '20px', height: '100%' }}
      tryAgainButton
    >
      <ConfirmedTxsListBase {...props} />
    </ExplorerErrorBoundary>
  );
}
