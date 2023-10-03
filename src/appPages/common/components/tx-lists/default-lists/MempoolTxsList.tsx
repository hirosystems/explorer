import { memo } from 'react';
import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { useApi } from '@/common/api/client';
import { SkeletonTransactionList } from '@/components/loaders/skeleton-transaction';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Box, Flex } from '@/ui/components';
import { Text } from '@/ui/typography';

import { useInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useMempoolTransactionsInfinite } from '../../../queries/useMempoolTransactionsInfinite';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { MempoolTxListItem } from '../list-items/MempoolTxListItem';

export const MempoolTxsList = memo(function ({ limit }: { limit?: number }) {
  const api = useApi();
  const response = useMempoolTransactionsInfinite(api);
  const txs = useInfiniteQueryResult<MempoolTransaction>(response, limit);

  if (response.isFetching) {
    return <SkeletonTransactionList />;
  }

  if (!txs?.length) {
    return (
      <Flex p="30px" justifyContent="center">
        <Text color="textBody">No pending transactions</Text>
      </Flex>
    );
  }
  return (
    <Box px="20px">
      <FilteredTxs txs={txs} TxListItem={MempoolTxListItem} />
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
