'use client';

import { Section } from '../common/components/Section';
import { SkeletonTxsList } from '../features/txs-list/SkeletonTxsList';
import { HomePageLayout } from './PageClient';
import { HomePageBlockListSkeleton } from './_components/BlockList/Grouped/skeleton';
import { PageTitle } from './_components/PageTitle';
import { StatsSkeleton } from './_components/Stats/skeleton';

export default function HomePageSkeleton() {
  return (
    <HomePageLayout
      title={<PageTitle data-test="homepage-title">Stacks Explorer</PageTitle>}
      stats={<StatsSkeleton />}
      txListTabs={
        <Section title={'Transactions'}>
          <SkeletonTxsList />
        </Section>
      }
      blockList={<HomePageBlockListSkeleton />}
    />
  );
}
