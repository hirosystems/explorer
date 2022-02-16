import React, { useMemo } from 'react';
import { Flex } from '@stacks/ui';
import { Section } from '@components/section';
import { HoverableItem } from '@components/hoverable';
import { useBlocksList } from './hooks';
import { BlockItem } from './block-list-item';
import { MicroblockItem } from './microblock-list-item';
import { SafeSuspense } from '@components/ssr-safe-suspense';
import { SectionFooterAction } from '@components/section-footer-button';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

interface HomeBlockListProps {
  limit: number;
}

export const HomeBlockList: React.FC<HomeBlockListProps> = ({ limit = DEFAULT_LIST_LIMIT }) => {
  const { data, error, isLoading } = useBlocksList(limit);
  const blocks = data?.results || [];

  const hashesToShow = useMemo(
    () =>
      Object.fromEntries(
        blocks
          .flatMap(block => [
            [block.hash, true],
            ...block.microblocks_accepted.map(microBlockHash => [microBlockHash, true]),
          ])
          .slice(0, limit)
      ),
    [blocks]
  );

  if (error || isLoading || !blocks.length) {
    return null;
  }

  return (
    <Section title="Recent Blocks">
      <Flex flexDirection="column" flexGrow={1} px="loose">
        {blocks.map((block, index) => {
          if (!hashesToShow[block.hash]) return null;
          return (
            <>
              <HoverableItem key={`blocks-list-${block.height}`}>
                <BlockItem block={block} index={index} length={blocks.length} />
              </HoverableItem>
              {block.microblocks_accepted.map((microblockHash, microblockIndex, microblocks) => {
                if (!hashesToShow[microblockHash]) return null;
                return (
                  <SafeSuspense fallback={<></>}>
                    <HoverableItem key={`microblocks-list-${microblockHash}`}>
                      <MicroblockItem
                        blockTime={block.burn_block_time}
                        hash={microblockHash}
                        index={microblockIndex}
                        length={blocks.length}
                      />
                    </HoverableItem>
                  </SafeSuspense>
                );
              })}
            </>
          );
        })}
        <SectionFooterAction
          path="blocks"
          isLoading={isLoading}
          showLoadMoreButton={false}
          hasNextPage={true}
        />
      </Flex>
    </Section>
  );
};
