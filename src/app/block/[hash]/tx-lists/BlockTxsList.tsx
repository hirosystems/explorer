'use client';

import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Section } from '../../../../common/components/Section';
import { SkeletonGenericTransactionList } from '../../../../common/components/loaders/skeleton-transaction';
import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockTxsInfinite } from '../../../../common/queries/useBlockTxsInfinite';
import { FilteredTxs } from '../../../../features/txs-list/FilteredTxs';
import { TxListItem } from '../../../../features/txs-list/ListItem/TxListItem';
import { FilterButton } from '../../../../features/txsFilterAndSort/FilterButton';
import { Box } from '../../../../ui/Box';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';

interface BlockTxsListProps {
  blockHash: string;
  limit?: number;
}

function BlockTxsListBase({ blockHash, limit }: BlockTxsListProps) {
  const response = useSuspenseBlockTxsInfinite(blockHash);
  const txs = useSuspenseInfiniteQueryResult<Transaction>(response, limit);

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <Section title={'Transactions'} topRight={<FilterButton />}>
      <Box flexGrow={1}>
        <Box position={'relative'}>
          <FilteredTxs txs={txs} TxListItem={TxListItem} />
          <ListFooter
            isLoading={response.isFetchingNextPage}
            hasNextPage={response.hasNextPage}
            fetchNextPage={limit ? undefined : response.fetchNextPage}
            label={'transactions'}
          />
        </Box>
      </Box>
    </Section>
  );
}

export function BlockTxsList(props: BlockTxsListProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{ title: 'Transactions' }}
      tryAgainButton
    >
      <BlockTxsListBase {...props} />
    </ExplorerErrorBoundary>
  );
}
