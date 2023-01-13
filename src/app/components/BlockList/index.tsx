'use client';

import { useApi } from '@/common/api/client';
import { SkeletonBlockList } from '@/components/loaders/skeleton-text';
import { Section } from '@/components/section';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Accordion } from '@/ui/Accordion';
import { AccordionButton } from '@/ui/AccordionButton';
import { AccordionIcon } from '@/ui/AccordionIcon';
import { AccordionItem } from '@/ui/AccordionItem';
import { AccordionPanel } from '@/ui/AccordionPanel';
import { Flex, Grid, Spinner } from '@/ui/components';
import { Caption, Text } from '@/ui/typography';
import dynamic from 'next/dynamic';
import React from 'react';

import { Block } from '@stacks/blockchain-api-client';

import { useInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useBlockListInfinite } from '../../common/queries/useBlockListInfinite';
import { useVerticallyStackedElementsBorderStyle } from '../../common/styles/border';
import { BlockListItem } from './BlockListItem';
import { MicroblockListItem } from './MicroblockListItem';

const BlocksListBase: React.FC<{
  limit?: number;
}> = ({ limit }) => {
  const api = useApi();
  const response = useBlockListInfinite(api);
  const { isError, isFetchingNextPage, fetchNextPage, hasNextPage } = response;

  const blocks = useInfiniteQueryResult<Block>(response, limit);

  if (isError) return <Text>Failed to load blocks</Text>;

  if (!blocks?.length)
    return (
      <Grid alignContent="center" flexGrow={1} px="16px" py="64px" placeItems="center">
        <Spinner size="lg" color={'textCaption'} />
        <Caption mt="32px" maxWidth="38ch">
          Blocks should start streaming in soon.
        </Caption>
      </Grid>
    );

  return (
    <Section
      title="Recent Blocks"
      gridColumnStart={['1', '1', '2']}
      gridColumnEnd={['2', '2', '3']}
      minWidth={0}
    >
      <Accordion allowMultiple>
        {blocks?.map((block, index, arr) => {
          return (
            <AccordionItem key={block.hash} pl={'20px'} border={'none'}>
              <Flex gap={'6px'}>
                <BlockListItem block={block} data-test={`block-${index}`} />
                <AccordionButton
                  flexGrow={0}
                  flexShrink={0}
                  width={'30px'}
                  ml={'auto'}
                  p={0}
                  justifyContent={'center'}
                >
                  <AccordionIcon />
                </AccordionButton>
              </Flex>
              <AccordionPanel p={'0 30px 0 0'} css={useVerticallyStackedElementsBorderStyle}>
                {!!block.microblocks_accepted?.length ? (
                  block.microblocks_accepted.map((microblockHash, microblockIndex) => (
                    <MicroblockListItem
                      blockTime={block.burn_block_time}
                      hash={microblockHash}
                      index={microblockIndex}
                      length={arr.length}
                      key={microblockHash}
                    />
                  ))
                ) : (
                  <Text fontSize={'14px'} p={'20px'} align={'center'}>
                    No Microblocks
                  </Text>
                )}
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
      <SectionFooterAction
        isLoading={isFetchingNextPage}
        hasNextPage={hasNextPage}
        href={limit ? '/blocks' : undefined}
        fetchNextPage={limit ? undefined : fetchNextPage}
        label={'blocks'}
      />
    </Section>
  );
};

export default BlocksListBase;

export const BlocksList = dynamic(() => import('.'), {
  loading: () => <SkeletonBlockList />,
  ssr: false,
});
