'use client';

import dynamic from 'next/dynamic';

import { FlexProps } from '../../../ui/Flex';
import { SkeletonTxsList } from '../SkeletonTxsList';
import { TxListTabsBase } from './TxListTabsBase';

export const ConfirmedTxsList = dynamic(
  () => import('../ConfirmedTxsList').then(module => module.ConfirmedTxsList),
  {
    loading: () => <SkeletonTxsList />,
    ssr: false,
  }
);

export const MempoolTxsList = dynamic(
  () => import('../MempoolTxsList').then(module => module.MempoolTxsList),
  {
    loading: () => <SkeletonTxsList />,
    ssr: false,
  }
);

export function TxListTabs({
  limit,
  showFilterButton,
  ...props
}: { limit?: number; showFilterButton?: boolean } & FlexProps) {
  return (
    <TxListTabsBase
      confirmedList={<ConfirmedTxsList limit={limit} />}
      mempoolList={<MempoolTxsList limit={limit} />}
      showFilterButton={showFilterButton}
      {...props}
    />
  );
}
