import dynamic from 'next/dynamic';
import { FC } from 'react';
import * as React from 'react';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { Section } from '../../../common/components/Section';
import { SkeletonTxsList } from '../SkeletonTxsList';
import { TxListTabsBase } from './TxListTabsBase';

const AddressConfirmedTxsList = dynamic(
  () => import('../AddressConfirmedTxsList').then(mod => mod.AddressConfirmedTxsList),
  {
    loading: () => <SkeletonTxsList />,
    ssr: false,
  }
);

const AddressMempoolTxsList = dynamic(
  () => import('../AddressMempoolTxsList').then(mod => mod.AddressMempoolTxsList),
  {
    loading: () => <SkeletonTxsList />,
    ssr: false,
  }
);

export const AddressTxListTabs: FC<{
  address: string;
}> = ({ address }) => {
  return (
    <ExplorerErrorBoundary Wrapper={Section} wrapperProps={{ padding: '150px 0' }} tryAgainButton>
      <TxListTabsBase
        confirmedList={<AddressConfirmedTxsList address={address} />}
        mempoolList={<AddressMempoolTxsList address={address} />}
      />
    </ExplorerErrorBoundary>
  );
};
