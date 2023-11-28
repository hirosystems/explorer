import * as React from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerErrorBoundary } from '../../../../app/_components/ErrorBoundary';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Text } from '../../../../ui/Text';
import { useSuspenseInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useSuspenseMempoolTransactionsInfinite } from '../../../queries/useMempoolTransactionsInfinite';
import { Section } from '../../Section';
import { SectionFooterActions } from '../../SectionFooterActions';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { MempoolTxListItem } from '../list-items/MempoolTxListItem';
import { ConfirmedTxsList } from '../tabs/DefaultTxListTabs';
import { TxListTabs } from '../tabs/TxListTabs';

interface MempoolTxsListProps {
  limit?: number;
}

function MempoolTxsListBase({ limit }: MempoolTxsListProps) {
  const response = useSuspenseMempoolTransactionsInfinite();
  const txs = useSuspenseInfiniteQueryResult<MempoolTransaction>(response, limit);

  if (!txs?.length) {
    return (
      <Flex p={'30px'} justifyContent={'center'}>
        <Text color={'textBody'}>No pending transactions</Text>
      </Flex>
    );
  }
  return (
    <Box px={'20px'}>
      <FilteredTxs txs={txs} TxListItem={MempoolTxListItem} />
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

export function MempoolTxsList(props: MempoolTxsListProps) {
  return (
    <ExplorerErrorBoundary Wrapper={Box} wrapperProps={{ px: '20px' }} tryAgainButton>
      <MempoolTxsListBase {...props} />
    </ExplorerErrorBoundary>
  );
}
