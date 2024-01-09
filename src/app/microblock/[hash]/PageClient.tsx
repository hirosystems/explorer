'use client';

import * as React from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Section } from '../../../common/components/Section';
import { Value } from '../../../common/components/Value';
import { useSuspenseBlockByHash } from '../../../common/queries/useBlockByHash';
import { useSuspenseMicroblockByHash } from '../../../common/queries/useMicroblockByHash';
import { toRelativeTime, truncateMiddle } from '../../../common/utils/utils';
import { SkeletonTxsList } from '../../../features/txs-list/SkeletonTxsList';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import { Tooltip } from '../../../ui/Tooltip';
import { PageTitle } from '../../_components/PageTitle';
import { MicroblockTxsList } from './tx-lists/MicroblockTxsList';

export default function MicroblockSinglePage({ params: { hash } }: any) {
  const queryOptions = {
    refetchOnWindowFocus: true,
    retry: 0,
  };

  const { data: microblock } = useSuspenseMicroblockByHash(hash, queryOptions);

  const { data: block } = useSuspenseBlockByHash(microblock?.block_hash, {
    ...queryOptions,
  });

  if (!microblock || !block) return null;

  const title = `Microblock ${truncateMiddle(microblock.microblock_hash)}`;

  const readableTs = `${new Date(block.burn_block_time * 1000).toLocaleTimeString()} ${new Date(
    block.burn_block_time * 1000
  ).toLocaleDateString()}`;

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Stack gap="16px">
        <Grid
          gridColumnGap="32px"
          gridTemplateColumns={'100%'}
          gridRowGap={['32px', '32px', 'unset']}
          maxWidth="100%"
          alignItems="flex-start"
        >
          <Section title="Summary">
            <Box px="16px">
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
        </Grid>
        {microblock.txs?.length ? (
          <MicroblockTxsList microblockHash={hash} />
        ) : (
          <Section title={'Transactions'} mt={'32px'}>
            <Box px="24px">
              <SkeletonTxsList txsCount={microblock?.txs.length} />
            </Box>
          </Section>
        )}
      </Stack>
    </>
  );
}
