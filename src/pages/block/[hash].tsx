import * as React from 'react';

import { Block, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex, Grid } from '@stacks/ui';
import { Title } from '@components/typography';
import { truncateMiddle } from '@common/utils';
import { Rows } from '@components/rows';
import Head from 'next/head';

import { NextPage } from 'next';
import { PageWrapper } from '@components/page';

import { ReduxNextPageContext } from '@common/types/next-store';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { fetchBlock } from '@common/api/blocks';
import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';
import { fetchTx } from '@common/api/transactions';
import { TransactionList } from '@components/transaction-list';

interface BlockSinglePageData {
  hash: string;
  block: Block;
  transactions?: Transaction[];
}

const BlockSinglePage: NextPage<BlockSinglePageData> = ({ block, hash, transactions }) => {
  console.log('block', block);
  return (
    <PageWrapper>
      <Head>
        <title>Block {truncateMiddle(hash)} | Stacks Explorer</title>
      </Head>
      <Flex mb="base" alignItems="flex-end" justifyContent="space-between">
        <Box>
          <Title mb="base" mt="64px" as="h1" color="white" fontSize="36px">
            Block details
          </Title>
        </Box>
      </Flex>
      <Grid gridTemplateColumns="1fr 320px" columnGap="base">
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
        <Section title="Bitcoin anchor">
          <Box px="base">
            <Rows
              noTopBorder
              inline
              items={[
                {
                  label: {
                    children: 'Bitcoin block',
                  },
                  children: block.burn_block_height,
                  copy: block.burn_block_height.toString(),
                },
                {
                  label: {
                    children: 'Bitcoin hash',
                  },
                  children: truncateMiddle(block.burn_block_hash, 12),
                  copy: block.burn_block_hash,
                },
                {
                  label: {
                    children: 'Anchor transaction',
                  },
                  children: truncateMiddle(block.miner_txid, 12),
                },
              ]}
            />
          </Box>
        </Section>
      </Grid>
      {transactions?.length ? (
        <TransactionList mt="extra-loose" transactions={transactions} />
      ) : null}
    </PageWrapper>
  );
};

BlockSinglePage.getInitialProps = async ({
  store,
  query,
}: ReduxNextPageContext): Promise<BlockSinglePageData> => {
  const hash = query?.hash?.toString() || '';
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getState } = store;
  const apiServer = selectCurrentNetworkUrl(getState());
  const data = await fetchBlock({ apiServer })({ hash });
  const txs: Promise<Transaction>[] = [];
  data.txs.forEach(tx => txs.push(fetchTx(apiServer)(tx)));
  const transactions: Transaction[] = await Promise.all(txs);

  return { hash, block: data, transactions };
};

export default BlockSinglePage;
