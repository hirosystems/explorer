'use client';

import { FlexProps } from '../../../ui/Flex';
import { ConfirmedTxsList } from '../ConfirmedTxsList';
import { MempoolTxsList } from '../MempoolTxsList';
import { TxListTabsBase } from './TxListTabsBase';

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
