import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerErrorBoundary } from '../../../../app/_components/ErrorBoundary';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Text } from '../../../../ui/Text';
import { useSuspenseInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useSuspenseConfirmedTransactionsInfinite } from '../../../queries/useConfirmedTransactionsInfinite';
import { SectionFooterActions } from '../../SectionFooterActions';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { TxListItem } from '../list-items/TxListItem';

interface ConfirmedTxsListProps {
  limit?: number;
}

function ConfirmedTxsListBase({ limit }: ConfirmedTxsListProps) {
  const response = useSuspenseConfirmedTransactionsInfinite();
  const txs = useSuspenseInfiniteQueryResult<Transaction>(response, limit);

  if (!txs?.length) {
    return (
      <Flex p={'30px'} justifyContent={'center'}>
        <Text color={'textBody'}>No transactions</Text>
      </Flex>
    );
  }

  return (
    <Box position={'relative'} px={'20px'}>
      <FilteredTxs txs={txs} TxListItem={TxListItem} />
      <SectionFooterActions
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
