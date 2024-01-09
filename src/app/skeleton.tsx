'use client';

import * as React from 'react';

import { Section } from '../common/components/Section';
import { SkeletonTxsList } from '../features/txs-list/SkeletonTxsList';
import { Grid } from '../ui/Grid';
import { SkeletonBlockList } from './_components/BlockList/SkeletonBlockList';
import { PageTitle } from './_components/PageTitle';
import { SkeletonStatSection } from './_components/Stats/SkeletonStatSection';
import { Wrapper } from './_components/Stats/Wrapper';

export default function Skeleton() {
  return (
    <>
      <PageTitle data-test="homepage-title">Stacks Explorer</PageTitle>
      <Wrapper>
        <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />
        <SkeletonStatSection borderRightWidth={['0px', '0px', '0px', '1px']} />
        <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />
        <SkeletonStatSection />
      </Wrapper>
      <Grid
        gap="7"
        width="full"
        gridTemplateColumns={['100%', '100%', 'minmax(0, 0.6fr) minmax(0, 0.4fr)']}
      >
        <Section title={'Transactions'}>
          <SkeletonTxsList />
        </Section>
        <SkeletonBlockList />
      </Grid>
    </>
  );
}
