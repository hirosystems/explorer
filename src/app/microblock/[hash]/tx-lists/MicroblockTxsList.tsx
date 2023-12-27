'use client';

import { FC, memo } from 'react';
import * as React from 'react';

import { TxLink } from '../../../../common/components/ExplorerLinks';
import { Section } from '../../../../common/components/Section';
import { TwoColsListItem } from '../../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../../common/components/TxIcon';
import { SkeletonGenericTransactionList } from '../../../../common/components/loaders/skeleton-transaction';
import { useSuspenseMicroblockByHash } from '../../../../common/queries/useMicroblockByHash';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Grid } from '../../../../ui/Grid';
import { Text, Title } from '../../../../ui/typography';

interface MicroblockTxsListProps {
  microblockHash: string;
  limit?: number;
}

export const MicroblockTxsList: FC<MicroblockTxsListProps> = memo(({ microblockHash, limit }) => {
  const { isLoading, data } = useSuspenseMicroblockByHash(microblockHash);

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
              key={txId}
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
            <Text mt="32px">No transactions yet</Text>
          </Grid>
        )}
      </Box>
    </Section>
  );
});
