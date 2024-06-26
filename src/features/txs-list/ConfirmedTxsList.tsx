import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerErrorBoundary } from '../../app/_components/ErrorBoundary';
import { ListFooter } from '../../common/components/ListFooter';
import { useInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useConfirmedTransactionsInfinite } from '../../common/queries/useConfirmedTransactionsInfinite';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Text } from '../../ui/Text';
import { FilteredTxs } from './FilteredTxs';
import { TxListItem } from './ListItem/TxListItem';
import { SkeletonTxsList } from './SkeletonTxsList';

interface ConfirmedTxsListProps {
  limit?: number;
}

function ConfirmedTxsListBase({ limit }: ConfirmedTxsListProps) {
  const response = useConfirmedTransactionsInfinite();
  const txs = useInfiniteQueryResult<Transaction>(response, limit);

  if (response.isLoading || response.isFetching) return <SkeletonTxsList />;

  if (!txs?.length) {
    return (
      <Flex py={12} justifyContent={'center'}>
        <Text fontSize={'sm'}>No transactions</Text>
      </Flex>
    );
  }

  return (
    <Box pb={6}>
      <FilteredTxs txs={txs} TxListItem={TxListItem} />
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
