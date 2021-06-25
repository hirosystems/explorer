import * as React from 'react';
import { Microblock, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';
import { Title } from '@components/typography';
import { queryWith0x, truncateMiddle } from '@common/utils';
import { Rows } from '@components/rows';
import { NextPage, NextPageContext } from 'next';
import { Section } from '@components/section';
import { FetchTransactionResponse, fetchTx, FetchTxResponse } from '@common/api/transactions';

import { getServerSideApiServer } from '@common/api/utils';
import { Meta } from '@components/meta-head';
import { PagePanes } from '@components/page-panes';
// import { BlockNotFound } from '@components/block-not-found';
import { TransactionList } from '@components/transaction-list';
import { fetchMicroblock } from '@common/api/microblocks';

interface MicroblockSinglePageData {
  hash: string;
  microblock: Microblock;
  transactions?: FetchTransactionResponse[];
  error?: boolean;
}

const MicroblockSinglePage: NextPage<MicroblockSinglePageData> = ({
  microblock,
  error,
  hash,
  transactions,
}) => {
  if (error) {
    return (
      <>
        <Meta title="Microblock hash not found" />
        {/* MICROBLOCK TODO: Need to make this */}
        {/* <MicroblockNotFound isPending={validateTxId(hash)} />; */}
      </>
    );
  }
  const title = `Microblock ${truncateMiddle(microblock.microblock_hash)}`;

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
      <PagePanes fullWidth>
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
                    children: 'Block size',
                  },
                  children: '',
                },
                {
                  label: {
                    children: 'Block rewards',
                  },
                  children: '',
                },
                {
                  label: {
                    children: 'Streamed',
                  },
                  children: '',
                },
                {
                  label: {
                    children: 'Streamed by',
                  },
                  children: '',
                },
              ]}
            />
          </Box>
        </Section>
      </PagePanes>
      {transactionsWithoutCoinbase?.length ? (
        <TransactionList mt="extra-loose" transactions={transactionsWithoutCoinbase} />
      ) : null}
    </>
  );
};

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{ props: MicroblockSinglePageData }> {
  const { query } = ctx;
  const hash = query?.hash ? queryWith0x(query?.hash?.toString()) : '';
  try {
    const apiServer = await getServerSideApiServer(ctx);
    const data = await fetchMicroblock(apiServer)(hash);
    const txs: Promise<FetchTxResponse>[] = [];
    data.txs.forEach((txid: string) => txs.push(fetchTx(apiServer)(txid)));
    const transactions = await Promise.all(txs);

    return {
      props: { hash, microblock: data, transactions: transactions as FetchTransactionResponse[] },
    };
  } catch (e) {
    return { props: { hash, error: true } } as any;
  }
}

export default MicroblockSinglePage;
