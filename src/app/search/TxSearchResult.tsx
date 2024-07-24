import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { ListFooter } from '../../common/components/ListFooter';
import { SkeletonGenericTransactionList } from '../../common/components/loaders/skeleton-transaction';
import { useInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useConfirmedTransactionsInfinite } from '../../common/queries/useConfirmedTransactionsInfinite';
import { NoTxs } from '../../features/search/NoTxs';
import { TxListItem } from '../../features/txs-list/ListItem/TxListItem';
import { ShowValueMenu } from '../../features/txsFilterAndSort/ShowValueMenu';
import { ConfirmedTxsSortMenu } from '../../features/txsFilterAndSort/SortMenu';
import { useFilterAndSortState } from '../../features/txsFilterAndSort/useFilterAndSortState';
import { Flex } from '../../ui/Flex';
import { Text } from '../../ui/Text';
import { FilterProps } from './filters';

function Header({ txCount }: { txCount: number }) {
  return (
    <Flex
      alignItems={'center'}
      justifyContent={'space-between'}
      py={6}
      flexDirection={['column', 'column', 'row']}
      gap={4}
    >
      <Text fontSize={'sm'} color="textSubdued">
        {txCount} result{txCount === 1 ? '' : 's'} found
      </Text>
      <Flex
        gap={2}
        flexWrap={['wrap', 'wrap', 'nowrap', 'nowrap']}
        justifyContent={['flex-start', 'flex-start', 'flex-end', 'flex-end']}
      >
        <ShowValueMenu />
        <ConfirmedTxsSortMenu />
      </Flex>
    </Flex>
  );
}

export function TxSearchResult({ filters }: FilterProps) {
  const { activeConfirmedTxsSort, activeConfirmedTxsOrder } = useFilterAndSortState();
  const response = useConfirmedTransactionsInfinite({
    ...filters,
    order: activeConfirmedTxsOrder,
    sortBy: activeConfirmedTxsSort,
  });
  const txs = useInfiniteQueryResult<Transaction>(response);

  const { isLoading, isError } = response;

  if (isLoading) {
    return <SkeletonGenericTransactionList />;
  }
  if (isError || !txs?.length) {
    return <NoTxs />;
  }

  return (
    <>
      <Header txCount={response.data?.pages[0]?.total || 0} />
      {txs.map((tx, i) => {
        return (
          <TxListItem
            tx={tx}
            key={tx.tx_id}
            simple
            {...(i === txs.length - 1 ? { borderBottom: 'none' } : {})}
          />
        );
      })}
      <ListFooter
        isLoading={response.isFetchingNextPage}
        hasNextPage={response.hasNextPage}
        fetchNextPage={response.fetchNextPage}
        label={'transactions'}
        pb={6}
      />
    </>
  );
}
