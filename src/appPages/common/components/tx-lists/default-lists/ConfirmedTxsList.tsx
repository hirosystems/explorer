import { memo } from 'react';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { useApi } from '@/common/api/client';
import { SkeletonTransactionList } from '@/components/loaders/skeleton-transaction';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Text } from '@/ui/Text';
import { Box, Flex } from '@/ui/components';

import { useInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useConfirmedTransactionsInfinite } from '../../../queries/useConfirmedTransactionsInfinite';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { TxListItem } from '../list-items/TxListItem';

export const ConfirmedTxsList = memo(function ({ limit }: { limit?: number }) {
  const api = useApi();
  const response = useConfirmedTransactionsInfinite(api);

  const txs = useInfiniteQueryResult<Transaction>(response, limit);

  if (response.isFetching) {
    return <SkeletonTransactionList />;
  }

  if (!txs?.length) {
    return (
      <Flex p="30px" justifyContent="center">
        <Text color="textBody">No transactions</Text>
      </Flex>
    );
  }

  return (
    <Box position="relative" px="20px">
      <FilteredTxs txs={txs} TxListItem={TxListItem} />
      <SectionFooterAction
        isLoading={response.isFetchingNextPage}
        hasNextPage={response.hasNextPage}
        href={limit ? '/transactions' : undefined}
        fetchNextPage={limit ? undefined : response.fetchNextPage}
        label="transactions"
      />
    </Box>
  );
});
