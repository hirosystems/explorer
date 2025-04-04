'use client';

import { Box, Flex } from '@chakra-ui/react';
import { use } from 'react';

import { NakamotoBlock } from '@stacks/blockchain-api-client';

import { BurnBlockGroupGrid } from '../../../app/_components/BlockList/Grouped/BlockListGrouped';
import { ScrollableBox } from '../../../app/_components/BlockList/ScrollableDiv';
import { createBlockListStxBlock } from '../../../app/_components/BlockList/utils';
import { NavBlock, NavDirection } from '../../../app/btcblock/[hash]/NavBlock';
import { ListFooter } from '../../../common/components/ListFooter';
import { Section } from '../../../common/components/Section';
import '../../../common/components/loaders/skeleton-text';
import { useSuspenseInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlocksByBurnBlock } from '../../../common/queries/useBlocksByBurnBlock';
import { useBurnBlock, useSuspenseBurnBlock } from '../../../common/queries/useBurnBlock';
import { PageTitle } from '../../_components/PageTitle';
import { TowColLayout } from '../../_components/TwoColLayout';
import { BitcoinAnchorDetails } from './BitcoinAnchorDetails';

export default function BitcoinBlockPage(props: { params: Promise<{ hash: string }> }) {
  const pageParams = use(props.params);
  const hash = pageParams?.hash || undefined;
  const { data: btcBlock } = useSuspenseBurnBlock(hash || '');
  const btcBlockHeight = btcBlock?.burn_block_height;

  const { data: prevBlock, isError: isPrevBlockError } = useBurnBlock(btcBlockHeight - 1);
  const { data: nextBlock, isError: isNextBlockError } = useBurnBlock(btcBlockHeight + 1);

  const stxBlocksResponse = useSuspenseBlocksByBurnBlock(btcBlock.burn_block_height, 15);
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = stxBlocksResponse;
  const stxBlocks = useSuspenseInfiniteQueryResult<NakamotoBlock>(stxBlocksResponse);
  const blockListStxBlocks = stxBlocks.map(createBlockListStxBlock);

  return (
    <>
      <Flex gap={4} alignItems="center" mt={20}>
        <NavBlock
          href={`/btcblock/${prevBlock?.burn_block_hash}`}
          direction={NavDirection.Backward}
          isDisabled={isPrevBlockError}
        />
        <PageTitle
          margin={0}
        >{`BTC Block #${btcBlock?.burn_block_height.toLocaleString()}`}</PageTitle>
        <NavBlock
          href={`/btcblock/${nextBlock?.burn_block_hash}`}
          direction={NavDirection.Forward}
          isDisabled={isNextBlockError}
        />
      </Flex>
      <TowColLayout>
        <Section title={`${btcBlock.stacks_blocks.length} Stacks Blocks`}>
          <Box py={2}>
            <ScrollableBox pt={3}>
              <BurnBlockGroupGrid
                stxBlocks={blockListStxBlocks}
                blocksCount={btcBlock.stacks_blocks.length}
                displayBlocksCount={false}
              />
            </ScrollableBox>
            <ListFooter
              pt={4}
              pb={6}
              isLoading={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              label={'blocks'}
            />
          </Box>
        </Section>
        <BitcoinAnchorDetails />
      </TowColLayout>
    </>
  );
}
