'use client';

import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { Section } from '../../../../common/components/Section';
import { SectionFooterActions } from '../../../../common/components/SectionFooterActions';
import { SkeletonGenericTransactionList } from '../../../../common/components/loaders/skeleton-transaction';
import { FilteredTxs } from '../../../../common/components/tx-lists/common/components/FilteredTxs';
import { TxListItem } from '../../../../common/components/tx-lists/list-items/TxListItem';
import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockTxsInfinite } from '../../../../common/queries/useBlockTxsInfinite';
import { FilterButton } from '../../../../features/txs-filter/FilterButton';
import { Box } from '../../../../ui/components';
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
        <Box position={'relative'} px={'20px'}>
          <FilteredTxs txs={txs} TxListItem={TxListItem} />
          <SectionFooterActions
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
