'use client';

import React from 'react';

import { Section } from '../../common/components/Section';
import { SkeletonBlockList } from '../../common/components/loaders/skeleton-text';
import { SkeletonBlock } from '../../common/components/loaders/skeleton-transaction';
import { Flex } from '../../ui/Flex';
import { SkeletonItem as SkeletonElement } from '../../ui/SkeletonItem';
import { PageTitle } from '../_components/PageTitle';

export default function Skeleton() {
  return (
    <>
      <PageTitle>
        <SkeletonElement width={'400px'} height={'43px'} />
      </PageTitle>
      <Section>
        <Flex flexDirection="column" flexGrow={1} data-testid="skeleton-block-list">
          {[...Array(10)].map((_, i) => (
            <SkeletonBlock key={i} />
          ))}
        </Flex>
      </Section>
    </>
  );
}
