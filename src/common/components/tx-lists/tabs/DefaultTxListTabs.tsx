'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC } from 'react';

import { SkeletonTransactionList } from '../../loaders/skeleton-transaction';
import { TxListTabs } from './TxListTabs';

export const ConfirmedTxsList = dynamic(
  () => import('../default-lists/ConfirmedTxsList').then(module => module.ConfirmedTxsList),
  {
    loading: () => <SkeletonTransactionList />,
    ssr: false,
  }
);

export const MempoolTxsList = dynamic(
  () => import('../default-lists/MempoolTxsList').then(module => module.MempoolTxsList),
  {
    loading: () => <SkeletonTransactionList />,
    ssr: false,
  }
);

export const DefaultTxListTabs: FC<{
  limit?: number;
}> = ({ limit }) => {
  return (
    <TxListTabs
      confirmedList={<ConfirmedTxsList limit={limit} />}
      mempoolList={<MempoolTxsList limit={limit} />}
    />
  );
};
