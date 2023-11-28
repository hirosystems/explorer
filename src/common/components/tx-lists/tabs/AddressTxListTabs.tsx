import dynamic from 'next/dynamic';
import { FC } from 'react';
import * as React from 'react';

import { ExplorerErrorBoundary } from '../../../../app/_components/ErrorBoundary';
import { Section } from '../../Section';
import { SkeletonTransactionList } from '../../loaders/skeleton-transaction';
import { TxListTabs } from './TxListTabs';

const AddressConfirmedTxsList = dynamic(
  () => import('../address-lists/AddressConfirmedTxsList').then(mod => mod.AddressConfirmedTxsList),
  {
    loading: () => <SkeletonTransactionList />,
    ssr: false,
  }
);

const AddressMempoolTxsList = dynamic(
  () => import('../address-lists/AddressMempoolTxsList').then(mod => mod.AddressMempoolTxsList),
  {
    loading: () => <SkeletonTransactionList />,
    ssr: false,
  }
);

export const AddressTxListTabs: FC<{
  address: string;
}> = ({ address }) => {
  return (
    <ExplorerErrorBoundary Wrapper={Section} wrapperProps={{ padding: '150px 0' }} tryAgainButton>
      <TxListTabs
        confirmedList={<AddressConfirmedTxsList address={address} />}
        mempoolList={<AddressMempoolTxsList address={address} />}
      />
    </ExplorerErrorBoundary>
  );
};
