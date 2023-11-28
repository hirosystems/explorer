'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import { BtcStxBlockLinks } from '../../../common/components/BtcStxBlockLinks';
import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Section } from '../../../common/components/Section';
import { Timestamp } from '../../../common/components/Timestamp';
import { Value } from '../../../common/components/Value';
import '../../../common/components/loaders/skeleton-text';
import { SkeletonTransactionList } from '../../../common/components/loaders/skeleton-transaction';
import { useVerticallyStackedElementsBorderStyle } from '../../../common/hooks/useVerticallyStackedElementsBorderStyle';
import { useSuspenseBlockByHash } from '../../../common/queries/useBlockByHash';
import { Box, Flex, Grid } from '../../../ui/components';
import { PageTitle } from '../../_components/PageTitle';
import { BlockBtcAnchorBlockCard } from './BlockBtcAnchorBlockCard';

const BlockTxsList = dynamic(
  () => import('./tx-lists/BlockTxsList').then(mod => mod.BlockTxsList),
  {
    loading: () => (
      <Section title={'Transactions'}>
        <SkeletonTransactionList />
      </Section>
    ),
    ssr: false,
  }
);

export default function BlockPage({ params: { hash } }: any) {
  const { data: block } = useSuspenseBlockByHash(hash, { refetchOnWindowFocus: true });
  const title = (block && `Block #${block.height.toLocaleString()}`) || '';

  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>{title}</PageTitle>
      <Grid
        gridColumnGap="32px"
        gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
        gridRowGap={['32px', '32px', 'unset']}
        maxWidth="100%"
        alignItems="flex-start"
      >
        <Section title="Summary">
          <Box px="16px" css={useVerticallyStackedElementsBorderStyle}>
            <KeyValueHorizontal label={'Hash'} value={<Value>{hash}</Value>} copyValue={hash} />
            {block && (
              <>
                <KeyValueHorizontal
                  label={'Block height'}
                  value={
                    <BtcStxBlockLinks
                      btcBlockHeight={block.burn_block_height}
                      stxBlockHeight={block.height}
                      stxBlockHash={block.hash}
                    />
                  }
                />
                <KeyValueHorizontal
                  label={'Mined'}
                  value={<Timestamp ts={block.burn_block_time} />}
                />
                <KeyValueHorizontal
                  label={'Transactions'}
                  value={<Value>{block.txs.length}</Value>}
                />
              </>
            )}
          </Box>
        </Section>
        <BlockBtcAnchorBlockCard />
      </Grid>
      <BlockTxsList blockHash={hash} />
    </Flex>
  );
}
