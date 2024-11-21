'use client';

import { Section } from '../common/components/Section';
import { SkeletonTxsList } from '../features/txs-list/SkeletonTxsList';
import { HomePageLayout } from './PageClient';
import { HomePageBlockListSkeleton } from './_components/BlockList/Grouped/skeleton';
import { PageTitle } from './_components/PageTitle';
import { SkeletonStatSection } from './_components/Stats/SkeletonStatSection';
import { Wrapper } from './_components/Stats/Wrapper';

export default function HomePageSkeleton() {
  return (
    <HomePageLayout
      title={<PageTitle data-test="homepage-title">Stacks Explorer</PageTitle>}
      stats={
        <Wrapper>
          <SkeletonStatSection
            borderRight={[
              'none',
              'none',
              '1px solid var(--stacks-colors-borderPrimary)',
              '1px solid var(--stacks-colors-borderPrimary)',
            ]}
          />
          <SkeletonStatSection
            borderRight={['none', 'none', 'none', '1px solid var(--stacks-colors-borderPrimary)']}
          />
          <SkeletonStatSection
            borderRight={[
              'none',
              'none',
              '1px solid var(--stacks-colors-borderPrimary)',
              '1px solid var(--stacks-colors-borderPrimary)',
            ]}
          />
          <SkeletonStatSection />
        </Wrapper>
      }
      txListTabs={
        <Section title={'Transactions'}>
          <SkeletonTxsList />
        </Section>
      }
      blockList={<HomePageBlockListSkeleton />}
    />
  );
}
