import { TxIcon } from '@/app/common/components/TxIcon';
import { useMicroblockByHash } from '@/app/common/queries/useMicroblockByHash';
import { useApi } from '@/common/api/client';
import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { truncateMiddle } from '@/common/utils';
import { TxLink } from '@/components/links';
import { SkeletonGenericTransactionList } from '@/components/loaders/skeleton-transaction';
import { Section } from '@/components/section';
import { Box, Grid } from '@/ui/components';
import { Text, Title } from '@/ui/typography';
import * as React from 'react';
import { FC, memo } from 'react';

interface MicroblockTxsListProps {
  microblockHash: string;
  limit?: number;
}

export const MicroblockTxsList: FC<MicroblockTxsListProps> = memo(({ microblockHash, limit }) => {
  const api = useApi();
  const { isLoading, data } = useMicroblockByHash(api, { microblockHash });

  if (isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  const txIds = data?.txs || [];

  return (
    <Section title={'Transactions'}>
      <Box px="20px">
        {!!txIds.length ? (
          txIds.map((txId: string) => (
            <TwoColsListItem
              icon={<TxIcon txType={'token_transfer'} />}
              leftContent={{
                title: (
                  <Title fontWeight="500" display="block" fontSize="15px">
                    <TxLink txId={txId}>{truncateMiddle(txId)}</TxLink>
                  </Title>
                ),
                subtitle: null,
              }}
            />
          ))
        ) : (
          <Grid placeItems="center" px="16px" py="32px">
            <Box as="img" src="/no-txs.svg" alt="No transactions yet" />
            <Text color={'textCaption'} mt="32px">
              No transactions yet
            </Text>
          </Grid>
        )}
      </Box>
    </Section>
  );
});
