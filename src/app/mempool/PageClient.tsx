'use client';

import { Section } from '@/common/components/Section';
import { MempoolTxsList } from '@/features/txs-list/MempoolTxsList';
import { Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { TokenPrice } from '../../common/types/tokenPrice';
import { PageTitle } from '../_components/PageTitle';
import { MempoolFeeStatsSkeleton } from './skeleton';

const MempoolFeeStatsDynamic = dynamic(
  () => import('./MempoolFeeStats').then(mod => mod.MempoolFeeStats),
  {
    loading: () => <MempoolFeeStatsSkeleton />,
    ssr: false,
  }
);

export default function ({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Mempool</PageTitle>
      </Flex>
      <MempoolFeeStatsDynamic tokenPrice={tokenPrice} />
      <Section>
        <MempoolTxsList />
      </Section>
    </>
  );
}
