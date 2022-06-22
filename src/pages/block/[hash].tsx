import { removeKeysWithUndefinedValues, validateTxId } from '@common/utils';
import * as React from 'react';
import { Rows } from '@components/rows';
import { Title } from '@components/typography';
import { CoinbaseTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';
import { NextPage } from 'next';

import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork, selectActiveNetworkUrl } from '@common/state/network-slice';
import { wrapper } from '@common/state/store';
import { BlockNotFound } from '@components/block-not-found';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { SectionBoxSkeleton } from '@components/loaders/skeleton-text';
import { SkeletonCoinbaseTransaction } from '@components/loaders/skeleton-transaction';
import { Meta } from '@components/meta-head';
import { PagePanes } from '@components/page-panes';
import { PageWrapper } from '@components/page-wrapper';
import { TransactionList, TxList } from '@components/transaction-list';
import { blockQK, BlockQueryKeys } from '@features/block/query-keys';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import { ServerResponse } from 'http';
import { useRouter } from 'next/router';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';

interface BlockSinglePageData {
  hash: string;
  error?: boolean;
}

const BlockSinglePage: NextPage<BlockSinglePageData> = ({ error }) => {
  const { query } = useRouter();
  const hash = query.hash as string;
  const networkUrl = useAppSelector(selectActiveNetwork).url;
  const queries = getTransactionQueries(networkUrl);

  const queryOptions = {
    refetchOnWindowFocus: false,
    retry: 0,
    staleTime: Infinity,
  };
  const { data: block } = useQuery(
    blockQK(BlockQueryKeys.block, hash),
    queries.fetchBlock(hash),
    queryOptions
  );

  const { data: transactions, isError } = useQuery(
    blockQK(BlockQueryKeys.blockTransactions, hash),
    queries.fetchBlockTransactions(hash),
    queryOptions
  );

  if (isError || !block) {
    return (
      <>
        <Meta title="Block hash not found" />
        <BlockNotFound isPending={validateTxId(hash)} />
      </>
    );
  }
  const title = `Block #${block.height.toLocaleString()}`;

  const coinbaseTx = transactions?.find(tx => tx.tx_type === 'coinbase') as CoinbaseTransaction;
  const transactionsWithoutCoinbase = transactions?.filter(tx => tx.tx_type !== 'coinbase');

  return (
    <PageWrapper>
      <Meta title={title} />
      <Flex mb="base" alignItems="flex-end" justifyContent="space-between">
        <Box>
          <Title mb="base" mt="64px" as="h1" color="white" fontSize="36px">
            {title}
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
                  children: `#${block.height}`,
                },
                {
                  label: {
                    children: 'Mined',
                  },
                  children: <Timestamp ts={block.burn_block_time} />,
                },
                {
                  label: {
                    children: 'Transactions',
                  },
                  children: block.txs.length,
                },
              ]}
            />
          </Box>
        </Section>
        <BtcAnchorBlockCard block={block} />
      </PagePanes>
      <Section overflow="hidden" px="base-loose" mt="extra-loose">
        {coinbaseTx ? <TxList items={[coinbaseTx]} /> : <SkeletonCoinbaseTransaction />}
      </Section>
      {transactionsWithoutCoinbase?.length ? (
        <TransactionList mt="extra-loose" transactions={transactionsWithoutCoinbase} />
      ) : (
        <SectionBoxSkeleton />
      )}
    </PageWrapper>
  );
};

const prefetchData = async (
  blockHash: string,
  res: ServerResponse,
  networkUrl?: string
): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  if (!networkUrl) {
    return queryClient;
  }
  const prefetchOptions = { retry: 0, staleTime: Infinity }; // mined block for a unique hash doesn't change
  const queries = getTransactionQueries(networkUrl);
  try {
    await queryClient.fetchQuery(
      blockQK(BlockQueryKeys.block, blockHash),
      queries.fetchBlock(blockHash),
      prefetchOptions
    );
  } catch (err) {
    res.statusCode = err.status;
  }
  return queryClient;
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query, res }) => {
  const client = await prefetchData(
    query.hash as string,
    res,
    selectActiveNetworkUrl(store.getState())
  );

  if (res.statusCode >= 500) {
    throw res;
  }

  const dehydratedState = removeKeysWithUndefinedValues(dehydrate(client));
  return {
    props: {
      isHome: false,
      dehydratedState,
    },
  };
});

export default BlockSinglePage;
