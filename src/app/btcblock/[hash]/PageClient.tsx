'use client';

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
import { useSuspenseBurnBlock } from '../../../common/queries/useBurnBlock';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { PageTitle } from '../../_components/PageTitle';
import { TowColLayout } from '../../_components/TwoColLayout';
import { BitcoinAnchorDetails } from './BitcoinAnchorDetails';

export default function BitcoinBlockPage({ params: { hash } }: any) {
  const { data: btcBlock } = useSuspenseBurnBlock(hash);
  const btcBlockHeight = btcBlock?.burn_block_height;

  const { data: prevBlock } = useSuspenseBurnBlock(btcBlockHeight - 1);
  const { data: nextBlock } = useSuspenseBurnBlock(btcBlockHeight + 1);

  const stxBlocksResponse = useSuspenseBlocksByBurnBlock(btcBlock.burn_block_height, 15);
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = stxBlocksResponse;
  const stxBlocks = useSuspenseInfiniteQueryResult<NakamotoBlock>(stxBlocksResponse);
  const blockListStxBlocks = stxBlocks.map(block => createBlockListStxBlock(block));

  return (
    <>
      <Flex gap={4} alignItems="center" mt={20}>
        <NavBlock
          href={`/btcblock/${prevBlock?.burn_block_hash}`}
          direction={NavDirection.Backward}
        />
        <PageTitle margin={0}>{`Block #${btcBlock?.burn_block_height.toLocaleString()}`}</PageTitle>
        <NavBlock
          href={`/btcblock/${nextBlock?.burn_block_hash}`}
          direction={NavDirection.Forward}
        />
      </Flex>
      <TowColLayout>
        <Section title={`${btcBlock.stacks_blocks.length} Stacks Blocks`}>
          <Box py={2}>
            <ScrollableBox pt={3}>
              <BurnBlockGroupGrid stxBlocks={blockListStxBlocks} minimized={false} />
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
