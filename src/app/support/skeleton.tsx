'use client';

import { Stack } from '@chakra-ui/react';

import { Section } from '../../common/components/Section';
import { SkeletonBlock } from '../../common/components/loaders/skeleton-transaction';
import { Skeleton as SkeletonElement } from '../../ui/Skeleton';
import { PageTitle } from '../_components/PageTitle';

export default function Skeleton() {
  return (
    <>
      <PageTitle>
        <SkeletonElement width={'400px'} height={'43px'} />
      </PageTitle>
      <Section>
        <Stack flexGrow={1} data-testid="skeleton-block-list">
          {[...Array(10)].map((_, i) => (
            <SkeletonBlock key={i} />
          ))}
        </Stack>
      </Section>
    </>
  );
}
