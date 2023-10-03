import { memo } from 'react';
import { TxIcon } from '@/appPages/common/components/TxIcon';
import { useMicroblockByHash } from '@/appPages/common/queries/useMicroblockByHash';
import { useApi } from '@/common/api/client';
import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { truncateMiddle } from '@/common/utils';
import { TxLink } from '@/components/links';
import { SkeletonGenericTransactionList } from '@/components/loaders/skeleton-transaction';
import { Section } from '@/components/section';
import { Box, Grid } from '@/ui/components';
import { Text, Title } from '@/ui/typography';

interface MicroblockTxsListProps {
  microblockHash: string;
  limit?: number;
}

export const MicroblockTxsList = memo(({ microblockHash, limit }: MicroblockTxsListProps) => {
  const api = useApi();
  const { isLoading, data } = useMicroblockByHash(api, { microblockHash });

  if (isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  const txIds = data?.txs || [];

  return (
    <Section title="Transactions">
      <Box px="20px">
        {txIds.length ? (
          txIds.map((txId: string) => (
            <TwoColsListItem
              key={txId}
              icon={<TxIcon txType="token_transfer" />}
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
            <Text color="textCaption" mt="32px">
              No transactions yet
            </Text>
          </Grid>
        )}
      </Box>
    </Section>
  );
});
