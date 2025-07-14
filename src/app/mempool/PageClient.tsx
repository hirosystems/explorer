'use client';

import { Section } from '@/common/components/Section';
import { MempoolTxsList } from '@/features/txs-list/MempoolTxsList';
import { Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { PageTitle } from '../_components/PageTitle';
import { SSRDisabledMessage } from '../_components/SSRDisabledMessage';
import { FeeEstimates } from '../context';
import { MempoolFeeStatsSkeleton } from './skeleton';

const MempoolFeeStatsDynamic = dynamic(
  () => import('./MempoolFeeStats').then(mod => mod.MempoolFeeStats),
  {
    loading: () => <MempoolFeeStatsSkeleton />,
    ssr: false,
  }
);

export default function ({ feeEstimates }: { feeEstimates?: FeeEstimates }) {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Mempool</PageTitle>
      </Flex>
      {feeEstimates ? (
        <MempoolFeeStatsDynamic feeEstimates={feeEstimates} />
      ) : (
        <SSRDisabledMessage sectionName="Mempool fee statistics" />
      )}

      <Section>
        <MempoolTxsList />
      </Section>
    </>
  );
}
