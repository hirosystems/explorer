'use client';

import { TxListTabs } from '@/features/txs-list/tabs/TxListTabs';
import { Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { TokenPrice } from '../../common/types/tokenPrice';
import { PageTitle } from '../_components/PageTitle';
import { FilterProps } from '../search/filters';
import { MempoolFeeStatsSkeleton } from './skeleton';

const MempoolFeeStatsDynamic = dynamic(
  () => import('./MempoolFeeStats').then(mod => mod.MempoolFeeStats),
  {
    loading: () => <MempoolFeeStatsSkeleton />,
    ssr: false,
  }
);

export default function ({ tokenPrice, filters }: { tokenPrice: TokenPrice } & FilterProps) {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex>
      <MempoolFeeStatsDynamic tokenPrice={tokenPrice} />
      <TxListTabs filters={filters} />
    </>
  );
}
