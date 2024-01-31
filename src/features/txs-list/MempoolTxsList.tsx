import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerErrorBoundary } from '../../app/_components/ErrorBoundary';
import { ListFooter } from '../../common/components/ListFooter';
import { useSuspenseInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useSuspenseMempoolTransactionsInfinite } from '../../common/queries/useMempoolTransactionsInfinite';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Text } from '../../ui/Text';
import { useFilterAndSortState } from '../txsFilterAndSort/useFilterAndSortState';
import { FilteredTxs } from './FilteredTxs';
import { MempoolTxListItem } from './ListItem/MempoolTxListItem';

interface MempoolTxsListProps {
  limit?: number;
}

function MempoolTxsListBase({ limit }: MempoolTxsListProps) {
  const { activeSort, activeOrder } = useFilterAndSortState();
  const response = useSuspenseMempoolTransactionsInfinite(activeSort, activeOrder);
  const txs = useSuspenseInfiniteQueryResult<MempoolTransaction>(response, limit);

  if (!txs?.length) {
    return (
      <Flex py={12} justifyContent={'center'}>
        <Text fontSize={'sm'}>No pending transactions</Text>
      </Flex>
    );
  }
  return (
    <Box pb={6}>
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
