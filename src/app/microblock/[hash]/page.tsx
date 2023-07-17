'use client';

import { PageTitle } from '@/app/common/components/PageTitle';
import { MicroblockTxsList } from '@/app/microblock/[hash]/tx-lists/MicroblockTxsList';
import { useGlobalContext } from '@/common/context/useAppContext';
import { toRelativeTime, truncateMiddle } from '@/common/utils';
import { SkeletonTransactionList } from '@/components/loaders/skeleton-transaction';
import { Meta } from '@/components/meta-head';
import { PageWrapper } from '@/components/page-wrapper';
import { Section } from '@/components/section';
import { BlockQueryKeys, blockQK } from '@/features/block/query-keys';
import { getBlockQueries } from '@/features/block/use-block-queries';
import { MicroblockQueryKeys, microblockQK } from '@/features/microblock/query-keys';
import { getMicroblockQueries } from '@/features/microblock/use-microblock-queries';
import { getTransactionQueries } from '@/features/transaction/use-transaction-queries';
import { Box, Flex, Icon, Stack, Tooltip } from '@/ui/components';
import * as React from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useQueries, useQuery } from '@tanstack/react-query';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../common/components/KeyValueHorizontal';
import { Value } from '../../common/components/Value';
import { useVerticallyStackedElementsBorderStyle } from '../../common/styles/border';

export default function MicroblockSinglePage({ params: { hash } }: any) {
  const networkUrl = useGlobalContext().activeNetwork.url;
  const queries = getMicroblockQueries(networkUrl);
  const transactionQueries = getTransactionQueries(networkUrl);
  const blockQueries = getBlockQueries(networkUrl);

  const queryOptions = {
    refetchOnWindowFocus: true,
    retry: 0,
  };

  const { data: microblock } = useQuery(
    microblockQK(MicroblockQueryKeys.microblock, hash),
    queries.fetchMicroblock(hash),
    queryOptions
  );

  const { data: block } = useQuery(
    blockQK(BlockQueryKeys.block, microblock?.block_hash || ''),
    blockQueries.fetchBlock(microblock?.block_hash),
    { ...queryOptions, enabled: !!microblock }
  );

  if (!microblock || !block) return null;

  const title = `Microblock ${truncateMiddle(microblock.microblock_hash)}`;

  const readableTs = `${new Date(block.burn_block_time * 1000).toLocaleTimeString()} ${new Date(
    block.burn_block_time * 1000
  ).toLocaleDateString()}`;

  return (
    <>
      <Meta title={title} />
      <PageTitle>{title}</PageTitle>
      <Stack gap="16px">
        <PageWrapper fullWidth>
          <Section title="Summary">
            <Box px="16px" css={useVerticallyStackedElementsBorderStyle}>
              <KeyValueHorizontal label={'Hash'} value={<Value>{hash}</Value>} copyValue={hash} />
              <KeyValueHorizontal
                label={'Block height'}
                value={<Value>{microblock.block_height}</Value>}
                copyValue={microblock.block_height.toString()}
              />
              <KeyValueHorizontal
                label={'Accepted'}
                value={
                  <Box>
                    <Tooltip label={readableTs}>
                      <Flex alignItems="center">
                        <Icon as={AiOutlineClockCircle} size="16px" mr="4px" />
                        <Value>{toRelativeTime(block.burn_block_time * 1000)}</Value>
                      </Flex>
                    </Tooltip>
                  </Box>
                }
                copyValue={readableTs}
              />
              <KeyValueHorizontal
                label={'Accepted by'}
                value={<Value>{block.hash}</Value>}
                copyValue={block.hash}
              />
              <KeyValueHorizontal
                label={'Transactions'}
                value={<Value>{microblock.txs.length}</Value>}
              />
            </Box>
          </Section>
        </PageWrapper>
        {microblock.txs?.length ? (
          <MicroblockTxsList microblockHash={hash} />
        ) : (
          <Section title={'Transactions'} mt={'32px'}>
            <Box px="24px">
              <SkeletonTransactionList length={microblock?.txs.length} />
            </Box>
          </Section>
        )}
      </Stack>
    </>
  );
}
