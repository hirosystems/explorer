import React from 'react';
import { color, Flex, FlexProps, Grid, Spinner } from '@stacks/ui';
import { Section } from '@components/section';
import { HoverableItem } from '@components/hoverable';
import { useBlocksList } from './hooks';
import { Caption } from '@components/typography';
import { BlockItem } from './block-list-item';
import { MicroblockItem } from './microblock-list-item';
import { SafeSuspense } from '@components/ssr-safe-suspense';
import { SectionFooterAction } from '@components/section-footer-button';

export const BlocksList: React.FC<FlexProps & { limit?: number; infinite?: boolean }> = ({
  infinite,
  limit,
  ...props
}) => {
  const [blocks, actions] = useBlocksList(limit);
  if (!blocks) return null;
  const hasBlocks = blocks?.pages?.[0]?.results?.length;

  return (
    <Section title="Recent Blocks" {...props}>
      <Flex flexDirection="column" flexGrow={1} px="loose">
        {hasBlocks ? (
          <>
            {blocks.pages.map((page, pageIndex, pages) => {
              const isLastPage = pageIndex === pages.length - 1;
              return (
                <>
                  {page?.results.map((block, index, arr) => {
                    const isLastItem = index === arr.length - 1;
                    return (
                      <>
                        <HoverableItem
                          key={`blocks-list-${block.height}`}
                          isLast={isLastPage && isLastItem}
                        >
                          <BlockItem block={block} index={index} length={arr.length} />
                        </HoverableItem>
                        {block.microblocks_accepted.map(
                          (microblockHash, microblockIndex, microblocks) => {
                            const isLastMicroblock = microblockIndex === microblocks.length - 1;
                            return (
                              <SafeSuspense
                                key={`microblocks-list-${microblockHash}`}
                                fallback={<></>}
                              >
                                <HoverableItem
                                  key={`microblocks-list-${microblockHash}`}
                                  isLast={isLastPage && isLastItem && isLastMicroblock}
                                >
                                  <MicroblockItem
                                    blockTime={block.burn_block_time}
                                    hash={microblockHash}
                                    index={microblockIndex}
                                    length={arr.length}
                                  />
                                </HoverableItem>
                              </SafeSuspense>
                            );
                          }
                        )}
                      </>
                    );
                  })}
                </>
              );
            })}

            <SectionFooterAction
              path="blocks"
              isLoading={actions.isFetchingNextPage}
              onClick={actions.fetchNextPage}
              showLoadMoreButton={infinite}
              hasNextPage={actions.hasNextPage}
            />
          </>
        ) : (
          <Grid alignContent="center" flexGrow={1} px="base" py="64px" placeItems="center">
            <Spinner size="lg" color={color('text-caption')} />
            <Caption mt="extra-loose" maxWidth="38ch">
              Blocks should start streaming in soon.
            </Caption>
          </Grid>
        )}
      </Flex>
    </Section>
  );
};
