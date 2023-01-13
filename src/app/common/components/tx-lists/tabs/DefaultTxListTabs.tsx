'use client';

import * as React from 'react';
import { FC } from 'react';

import { ConfirmedTxsList } from '../default-lists/ConfirmedTxsList';
import { MempoolTxsList } from '../default-lists/MempoolTxsList';
import { TxListTabs } from './TxListTabs';

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
