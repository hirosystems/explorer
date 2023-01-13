import * as React from 'react';
import { FC } from 'react';

import { AddressConfirmedTxsList } from '../address-lists/AddressConfirmedTxsList';
import { AddressMempoolTxsList } from '../address-lists/AddressMempoolTxsList';
import { TxListTabs } from './TxListTabs';

export const AddressTxListTabs: FC<{
  address: string;
}> = ({ address }) => {
  return (
    <TxListTabs
      confirmedList={<AddressConfirmedTxsList address={address} />}
      mempoolList={<AddressMempoolTxsList address={address} />}
    />
  );
};
