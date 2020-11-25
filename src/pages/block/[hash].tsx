import * as React from 'react';
import { Block, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';
import { Title } from '@components/typography';
import { queryWith0x, truncateMiddle } from '@common/utils';
import { Rows } from '@components/rows';

import { NextPage, NextPageContext } from 'next';
import { PageWrapper } from '@components/page';
import { fetchBlock } from '@common/api/blocks';
import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';
import { fetchTx, FetchTxResponse } from '@common/api/transactions';
import { TransactionList } from '@components/transaction-list';
import { getServerSideApiServer } from '@common/api/utils';
import { Meta } from '@components/meta-head';
import { PagePanes } from '@components/page-panes';

interface BlockSinglePageData {
  hash: string;
  block: Block;
  transactions?: FetchTxResponse[];
}

const BlockSinglePage: NextPage<BlockSinglePageData> = ({ block, hash, transactions }) => {
  const title = `Block #${block.height.toLocaleString()}`;
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
      </PagePanes>
      {transactions?.length ? (
        <TransactionList mt="extra-loose" transactions={transactions as Transaction[]} />
      ) : null}
    </PageWrapper>
  );
};

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{ props: BlockSinglePageData }> {
  const { query } = ctx;
  const hash = query?.hash ? queryWith0x(query?.hash?.toString()) : '';
  const apiServer = getServerSideApiServer(ctx);
  const data = await fetchBlock(apiServer)(hash);
  const txs: Promise<FetchTxResponse>[] = [];
  data.txs.forEach((txid: string) => txs.push(fetchTx(apiServer)(txid)));
  const transactions: FetchTxResponse[] = await Promise.all(txs);

  return { props: { hash, block: data, transactions } };
}

export default BlockSinglePage;
