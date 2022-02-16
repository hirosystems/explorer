import React, { useMemo } from 'react';
import { color, Flex, FlexProps, Grid, Spinner } from '@stacks/ui';
import { Section } from '@components/section';
import { HoverableItem } from '@components/hoverable';
import { useBlocksListOld } from './hooks';
import { Caption } from '@components/typography';
import { BlockItem } from './block-list-item';
import { MicroblockItem } from './microblock-list-item';
import { SafeSuspense } from '@components/ssr-safe-suspense';
import { SectionFooterAction } from '@components/section-footer-button';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

export const BlocksList: React.FC<
  FlexProps & { enforceLimit?: boolean; limit?: number; infinite?: boolean }
> = ({ infinite, limit = DEFAULT_LIST_LIMIT, enforceLimit, ...props }) => {
  const [blocks, actions] = useBlocksListOld(limit);
  if (!blocks) return null;
  const hasBlocks = blocks?.pages?.[0]?.results?.length;
  const firstPage = blocks.pages?.[0].results;

  // due to the way that we fetch from two endpoints (blocks and microblocks)
  // we need to generate a combined flat list of hashes to know which hashes
  // fall within a given limit
  const hashesToShow = useMemo(() => {
    if (!enforceLimit) return {};
    const _index: Record<string, number> = {};
    const flatmap = firstPage
      .map(block => [block.hash, ...block.microblocks_accepted.map(mb => mb)])
      .flat(5);

    flatmap.forEach((hash, index) => {
      _index[hash] = index + 1;
    });
    return _index;
  }, [firstPage, enforceLimit]);

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
                    const isLastItem =
                      index === arr.length - 1 ||
                      (enforceLimit && hashesToShow[block.hash] === limit);
                    if (enforceLimit && hashesToShow[block.hash] > limit) return null;
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
                            const isLastMicroblock =
                              microblockIndex === microblocks.length - 1 ||
                              (enforceLimit && hashesToShow[microblockHash] === limit);
                            if (enforceLimit && hashesToShow[microblockHash] > limit) return null;

                            return (
                              <SafeSuspense fallback={<></>}>
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
