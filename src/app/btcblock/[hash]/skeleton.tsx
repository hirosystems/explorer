'use client';

import { Box, Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { BurnBlockGroupGridLayout } from '../../../app/_components/BlockList/Grouped/BlockListGrouped';
import {
  BlockListGridHeaderRowSkeleton,
  BlockListLoadMoreButtonSkeleton,
} from '../../../app/_components/BlockList/Grouped/skeleton';
import { ScrollableBox } from '../../../app/_components/BlockList/ScrollableDiv';
import { BlockListRowSkeleton } from '../../../app/_components/BlockList/Ungrouped/skeleton';
import { KeyValueVertical } from '../../../common/components/KeyValueVertical';
import { Section } from '../../../common/components/Section';
import '../../../common/components/loaders/skeleton-text';
import { Skeleton } from '../../../ui/Skeleton';
import { TowColLayout } from '../../_components/TwoColLayout';

const StyledSection = styled(Section)`
  .key-value-vertical:not(:last-child) {
    border-bottom: 1px solid var(--stacks-colors-border-secondary);
  }
`;

export function BitcoinAnchorDetailsSkeleton() {
  return (
    <StyledSection title={<Skeleton width={20} height={5} />}>
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        <KeyValueVertical
          className="key-value-vertical"
          label={<Skeleton width={20} height={4} />}
          value={<Skeleton width={40} height={10} />}
          key={`key-value-vertical-${rowIndex}`}
        />
      ))}
    </StyledSection>
  );
}

export function BlockPageSkeleton() {
  return (
    <>
      <Flex mt={20}>
        <Skeleton width={400} height={10} />
      </Flex>
      <TowColLayout>
        <Section title={<Skeleton width={20} height={5} />}>
          <Box py={2}>
            <ScrollableBox pt={3}>
              <BurnBlockGroupGridLayout minimized={false}>
                <BlockListGridHeaderRowSkeleton />
                {Array.from({ length: 15 }).map((_, rowIndex) => (
                  <BlockListRowSkeleton
                    isFirst={rowIndex === 0}
                    isLast={rowIndex === 14}
                    minimized={false}
                    key={`block-list-row-skeleton-${rowIndex}`}
                  />
                ))}
              </BurnBlockGroupGridLayout>
            </ScrollableBox>
            <BlockListLoadMoreButtonSkeleton pt={4} pb={6} />
          </Box>
        </Section>
        <BitcoinAnchorDetailsSkeleton />
      </TowColLayout>
    </>
  );
}
