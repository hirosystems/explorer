'use client';

import { PageTitle } from '@/app/common/components/PageTitle';
import { useGlobalContext } from '@/common/context/useAppContext';
import { BtcStxBlockLinks } from '@/components/btc-stx-block-links';
import { FilterButton } from '@/components/filter-button';
import '@/components/loaders/skeleton-text';
import { SectionBoxSkeleton } from '@/components/loaders/skeleton-transaction';
import { Meta } from '@/components/meta-head';
import { PageWrapper } from '@/components/page-wrapper';
import { Section } from '@/components/section';
import { Timestamp } from '@/components/timestamp';
import { BlockQueryKeys, blockQK } from '@/features/block/query-keys';
import { getBlockQueries } from '@/features/block/use-block-queries';
import { getTransactionQueries } from '@/features/transaction/use-transaction-queries';
import { Box } from '@/ui/components';
import * as React from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { KeyValueHorizontal } from '../../common/components/KeyValueHorizontal';
import { Value } from '../../common/components/Value';
import { useVerticallyStackedElementsBorderStyle } from '../../common/styles/border';
import { BtcAnchorBlockCard } from '../../txid/[txid]/Cards/BtcAnchorBlockCard';
import { BlockTxsList } from './tx-lists/BlockTxsList';

export default function BlockSinglePage({ params: { hash } }: any) {
  const networkUrl = useGlobalContext().activeNetwork.url;
  const blockQueries = getBlockQueries(networkUrl);
  const transactionQueries = getTransactionQueries(networkUrl);

  const queryOptions = {
    refetchOnWindowFocus: true,
    retry: 0,
    staleTime: Infinity,
  };

  const { data: block } = useQuery(
    blockQK(BlockQueryKeys.block, hash),
    blockQueries.fetchBlock(hash),
    queryOptions
  );

  const blockTransactionsResponse = useInfiniteQuery(
    blockQK(BlockQueryKeys.blockTransactions, hash),
    transactionQueries.fetchBlockTransactions(hash),
    queryOptions
  );

  const title = (block && `Block #${block.height.toLocaleString()}`) || '';

  return (
    <>
      <Meta title={title} />
      <PageTitle>{title}</PageTitle>
      <PageWrapper>
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
        {block ? <BtcAnchorBlockCard block={block} /> : null}
      </PageWrapper>
      {blockTransactionsResponse.isLoading ? (
        <SectionBoxSkeleton />
      ) : !!blockTransactionsResponse.data ? (
        <Section title={'Transactions'} topRight={<FilterButton />} mt="32px">
          <Box flexGrow={1}>
            <BlockTxsList blockHash={hash} />
          </Box>
        </Section>
      ) : null}
    </>
  );
}
