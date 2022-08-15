import { validateTxId } from '@common/utils';
import * as React from 'react';
import { Rows } from '@components/rows';
import { Title } from '@components/typography';
import { CoinbaseTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';
import { NextPage } from 'next';

import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { BlockNotFound } from '@components/block-not-found';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import {} from '@components/loaders/skeleton-text';
import {
  SectionBoxSkeleton,
  SkeletonCoinbaseTransaction,
} from '@components/loaders/skeleton-transaction';
import { Meta } from '@components/meta-head';
import { PagePanes } from '@components/page-panes';
import { PageWrapper } from '@components/page-wrapper';
import { TransactionList, TxList } from '@components/transaction-list';
import { blockQK, BlockQueryKeys } from '@features/block/query-keys';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import { useRouter } from 'next/router';
import { BtcStxBlockLinks } from '@components/btc-stx-block-links';
import { useQuery } from 'react-query';
import { SkeletonPageTitle } from '@components/loaders/skeleton-common';

interface BlockSinglePageData {
  hash: string;
  error?: boolean;
}

const BlockSinglePage: NextPage<BlockSinglePageData> = () => {
  const { query } = useRouter();
  const hash = query.hash as string;
  const networkUrl = useAppSelector(selectActiveNetwork).url;
  const queries = getTransactionQueries(networkUrl);

  const queryOptions = {
    refetchOnWindowFocus: false,
    retry: 0,
    staleTime: Infinity,
  };

  const { data: block, isError: blockIsError } = useQuery(
    blockQK(BlockQueryKeys.block, hash),
    queries.fetchBlock(hash),
    queryOptions
  );

  const { data: transactions } = useQuery(
    blockQK(BlockQueryKeys.blockTransactions, hash),
    queries.fetchBlockTransactions(hash),
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

  const coinbaseTx = transactions?.find(tx => tx.tx_type === 'coinbase') as CoinbaseTransaction;
  const transactionsWithoutCoinbase = transactions?.filter(tx => tx.tx_type !== 'coinbase');

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
      <Section overflow="hidden" px="base-loose" mt="extra-loose">
        {coinbaseTx ? <TxList items={[coinbaseTx]} /> : <SkeletonCoinbaseTransaction />}
      </Section>
      {typeof transactionsWithoutCoinbase === 'undefined' ? (
        <SectionBoxSkeleton />
      ) : transactionsWithoutCoinbase.length ? (
        <TransactionList mt="extra-loose" transactions={transactionsWithoutCoinbase} />
      ) : null}
    </PageWrapper>
  );
};

export default BlockSinglePage;
