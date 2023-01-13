import { BlockQueryKeys, blockQK } from '@features/block/query-keys';
import { getBlockQueries } from '@features/block/use-block-queries';
import { MicroblockQueryKeys, microblockQK } from '@features/microblock/query-keys';
import { getMicroblockQueries } from '@features/microblock/use-microblock-queries';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useQueries, useQuery } from 'react-query';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';

import { getMicroblockHashFromServerSideCtx } from '@common/page-queries/microblock-hash';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { truncateMiddle, validateTxId } from '@common/utils';

import { SkeletonPageTitle } from '@components/loaders/skeleton-common';
import { SkeletonFees } from '@components/loaders/skeleton-text';
import { SkeletonTransactionList } from '@components/loaders/skeleton-transaction';
import { Meta } from '@components/meta-head';
import { MicroblockNotFound } from '@components/microblock-not-found';
import { PagePanes } from '@components/page-panes';
import { Rows } from '@components/rows';
import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';
import { TransactionList } from '@components/transaction-list';
import { Title } from '@components/typography';

interface MicroblockSinglePageData {
  hash: string;
  error?: boolean;
}

const MicroblockSinglePage: NextPage<MicroblockSinglePageData> = () => {
  const { query } = useRouter();
  const hash = query.hash as string;
  const networkUrl = useAppSelector(selectActiveNetwork).url;
  const queries = getMicroblockQueries(networkUrl);
  const transactionQueries = getTransactionQueries(networkUrl);
  const blockQueries = getBlockQueries(networkUrl);

  const queryOptions = {
    refetchOnWindowFocus: true,
    retry: 0,
  };

  const { data: microblock, isError: microblockIsError } = useQuery(
    microblockQK(MicroblockQueryKeys.microblock, hash),
    queries.fetchMicroblock(hash),
    queryOptions
  );

  const { data: block, isError: blockIsError } = useQuery(
    blockQK(BlockQueryKeys.block, microblock?.block_hash || ''),
    blockQueries.fetchBlock(microblock?.block_hash),
    { ...queryOptions, enabled: !!microblock }
  );

  const useQueriesOptionsForTransactions = microblock?.txs.map(txId => {
    return {
      queryKey: microblockQK(MicroblockQueryKeys.tx, txId),
      queryFn: transactionQueries.fetchSingleTransaction({ txId }),
      enabled: !!microblock,
    };
  });

  const dataTransactions = useQueries(useQueriesOptionsForTransactions ?? []);

  if (microblockIsError || blockIsError) {
    return (
      <>
        <Meta title="Microblock hash not found" />
        <MicroblockNotFound isPending={validateTxId(hash)} />
      </>
    );
  }
  const title = microblock ? `Microblock ${truncateMiddle(microblock.microblock_hash)}` : undefined;

  const transactions = dataTransactions?.map(({ data }) => data as Transaction).filter(tx => !!tx);

  return (
    <>
      <Meta title={title} />
      <Flex mb="base" alignItems="flex-end" justifyContent="space-between">
        <Box>
          <Title mb="base" mt="64px" as="h1" color="white" fontSize="36px">
            {title || <SkeletonPageTitle />}
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
                  children: hash ?? undefined,
                  copy: hash,
                },
                {
                  label: {
                    children: 'Block height',
                  },
                  children: microblock ? `#${microblock.block_height}` : undefined,
                },
                {
                  label: {
                    children: 'Accepted',
                  },
                  children: block ? <Timestamp ts={block.burn_block_time} /> : <SkeletonFees />,
                },
                {
                  label: {
                    children: 'Accepted by',
                  },
                  children: block ? block.hash : undefined,
                },
                {
                  label: {
                    children: 'Transactions',
                  },
                  children: microblock ? microblock.txs.length : undefined,
                },
              ]}
            />
          </Box>
        </Section>
      </PagePanes>
      {transactions?.length ? (
        <TransactionList mt="extra-loose" transactions={transactions} />
      ) : (
        <Section title={'Transactions'} mt={'32px'}>
          <Box px="loose">
            <SkeletonTransactionList length={microblock?.txs.length} />
          </Box>
        </Section>
      )}
    </>
  );
};

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  const hash = getMicroblockHashFromServerSideCtx(ctx);
  return {
    props: {
      hash,
    },
  };
}

export default MicroblockSinglePage;