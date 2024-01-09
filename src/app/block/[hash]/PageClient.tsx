'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import { BtcStxBlockLinks } from '../../../common/components/BtcStxBlockLinks';
import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Section } from '../../../common/components/Section';
import { Timestamp } from '../../../common/components/Timestamp';
import { TwoColumnPage } from '../../../common/components/TwoColumnPage';
import { Value } from '../../../common/components/Value';
import '../../../common/components/loaders/skeleton-text';
import { useSuspenseBlockByHash } from '../../../common/queries/useBlockByHash';
import { SkeletonTxsList } from '../../../features/txs-list/SkeletonTxsList';
import { Box, Flex, Grid } from '../../../ui/components';
import { PageTitle } from '../../_components/PageTitle';
import { TowColLayout } from '../../_components/TwoColLayout';
import { BlockBtcAnchorBlockCard } from './BlockBtcAnchorBlockCard';

const BlockTxsList = dynamic(
  () => import('./tx-lists/BlockTxsList').then(mod => mod.BlockTxsList),
  {
    loading: () => (
      <Section title={'Transactions'}>
        <SkeletonTxsList />
      </Section>
    ),
    ssr: false,
  }
);

export default function BlockPage({ params: { hash } }: any) {
  const { data: block } = useSuspenseBlockByHash(hash, { refetchOnWindowFocus: true });
  const title = (block && `Block #${block.height.toLocaleString()}`) || '';
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <TowColLayout>
        <Section title="Summary">
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
        </Section>
        <BlockBtcAnchorBlockCard />
      </TowColLayout>
      <BlockTxsList blockHash={hash} />
    </>
  );
}
