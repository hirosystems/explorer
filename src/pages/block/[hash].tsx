import * as React from 'react';
import { Block, CoinbaseTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';
import { Title } from '@components/typography';
import { queryWith0x, validateTxId } from '@common/utils';
import { Rows } from '@components/rows';
import { NextPage, NextPageContext } from 'next';
import { fetchBlock } from '@common/api/blocks';
import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';
import { FetchTransactionResponse, fetchTx, FetchTxResponse } from '@common/api/transactions';

import { getServerSideApiServer } from '@common/api/utils';
import { Meta } from '@components/meta-head';
import { PagePanes } from '@components/page-panes';
import { BlockNotFound } from '@components/block-not-found';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { TransactionList, TxList } from '@components/transaction-list';

interface BlockSinglePageData {
  hash: string;
  block: Block;
  transactions?: FetchTransactionResponse[];
  error?: boolean;
}

const BlockSinglePage: NextPage<BlockSinglePageData> = ({ block, error, hash, transactions }) => {
  if (error) {
    return (
      <>
        <Meta title="Block hash not found" />
        <BlockNotFound isPending={validateTxId(hash)} />;
      </>
    );
  }
  const title = `Block #${block.height.toLocaleString()}`;

  const coinbaseTx = (transactions as Transaction[])?.find(
    tx => tx.tx_type === 'coinbase'
  ) as CoinbaseTransaction;

  const transactionsWithoutCoinbase = (transactions as Transaction[])?.filter(
    tx => tx.tx_type !== 'coinbase'
  );
  return (
    <>
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
        <TxList items={[coinbaseTx]} />
      </Section>
      {transactionsWithoutCoinbase?.length ? (
        <TransactionList mt="extra-loose" transactions={transactionsWithoutCoinbase} />
      ) : null}
    </>
  );
};

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{ props: BlockSinglePageData }> {
  const { query } = ctx;
  const hash = query?.hash ? queryWith0x(query?.hash?.toString()) : '';
  try {
    const apiServer = await getServerSideApiServer(ctx);
    const data = await fetchBlock(apiServer)(hash);
    const txs: Promise<FetchTxResponse>[] = [];
    data.txs.forEach((txid: string) => txs.push(fetchTx(apiServer)(txid)));
    const transactions = await Promise.all(txs);

    return {
      props: { hash, block: data, transactions: transactions as FetchTransactionResponse[] },
    };
  } catch (e) {
    return { props: { hash, error: true } } as any;
  }
}

export default BlockSinglePage;
