import { validateTxId } from '@common/utils';
import * as React from 'react';
import { Rows } from '@components/rows';
import { Title } from '@components/typography';
import { Box, Flex } from '@stacks/ui';
import { NextPage } from 'next';
import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { BlockNotFound } from '@components/block-not-found';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import {} from '@components/loaders/skeleton-text';
import { SectionBoxSkeleton } from '@components/loaders/skeleton-transaction';
import { Meta } from '@components/meta-head';
import { PagePanes } from '@components/page-panes';
import { PageWrapper } from '@components/page-wrapper';
import { blockQK, BlockQueryKeys } from '@features/block/query-keys';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import { useRouter } from 'next/router';
import { SkeletonPageTitle } from '@components/loaders/skeleton-common';
import { useQuery, useInfiniteQuery } from 'react-query';
import { BtcStxBlockLinks } from '@components/btc-stx-block-links';
import { TxsList } from '@modules/TransactionList/components/TxsList';
import { FilterButton } from '@components/filter-button';
import { getBlockQueries } from '@features/block/use-block-queries';

interface BlockSinglePageData {
  hash: string;
  error?: boolean;
}

const BlockSinglePage: NextPage<BlockSinglePageData> = () => {
  const { query } = useRouter();
  const hash = query.hash as string;
  const networkUrl = useAppSelector(selectActiveNetwork).url;
  const blockQueries = getBlockQueries(networkUrl);
  const transactionQueries = getTransactionQueries(networkUrl);

  const queryOptions = {
    refetchOnWindowFocus: true,
    retry: 0,
    staleTime: Infinity,
  };

  const { data: block, isError: blockIsError } = useQuery(
    blockQK(BlockQueryKeys.block, hash),
    blockQueries.fetchBlock(hash),
    queryOptions
  );

  const blockTransactionsResponse = useInfiniteQuery(
    blockQK(BlockQueryKeys.blockTransactions, hash),
    transactionQueries.fetchBlockTransactions(hash),
    queryOptions
  );

  if (blockIsError) {
    return (
      <>
        <Meta title="Block hash not found" />
        <BlockNotFound isPending={validateTxId(hash)} />
      </>
    );
  }

  const title = (block && `Block #${block.height.toLocaleString()}`) || '';

  return (
    <PageWrapper>
      <Meta title={title} />
      <Flex mb="base" alignItems="flex-end" justifyContent="space-between">
        <Box>
          <Title mb="base" mt="64px" as="h1" color="white" fontSize="36px">
            {title || <SkeletonPageTitle />}
          </Title>
        </Box>
      </Flex>
      <PagePanes>
        <Section title="Summary">
          <Box px="base">
            <Rows
              noTopBorder
              items={[
                {
                  label: {
                    children: 'Hash',
                  },
                  children: hash,
                  copy: hash,
                },
                {
                  label: {
                    children: 'Block height',
                  },
                  children: block ? (
                    <BtcStxBlockLinks
                      btcBlockHeight={block.burn_block_height}
                      stxBlockHeight={block.height}
                      stxBlockHash={block.hash}
                    />
                  ) : undefined,
                },
                {
                  label: {
                    children: 'Mined',
                  },
                  children: (block && <Timestamp ts={block.burn_block_time} />) || undefined,
                },
                {
                  label: {
                    children: 'Transactions',
                  },
                  children: (block && block.txs.length) || undefined,
                },
              ]}
            />
          </Box>
        </Section>
        {block ? <BtcAnchorBlockCard block={block} /> : null}
      </PagePanes>
      {blockTransactionsResponse.isLoading ? (
        <SectionBoxSkeleton />
      ) : !!blockTransactionsResponse.data ? (
        <Section
          title={'Transactions'}
          topRight={FilterButton}
          headerProps={{ pl: '0', pr: '0' }}
          px="base-loose"
          mt="extra-loose"
        >
          <Box flexGrow={1}>
            <TxsList response={blockTransactionsResponse} />
          </Box>
        </Section>
      ) : null}
    </PageWrapper>
  );
};

export default BlockSinglePage;
