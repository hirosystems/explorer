'use client';

import { FlexProps } from '@chakra-ui/react';

import { ConfirmedTxsList } from '../ConfirmedTxsList';
import { MempoolTxsList } from '../MempoolTxsList';
import { TxListTabsBase } from './TxListTabsBase';

export function TxListTabs({
  limit,
  showFilterButton,
  showValueMenu,
  filters,
  ...props
}: {
  limit?: number;
  showFilterButton?: boolean;
  showValueMenu?: boolean;
  filters?: Record<string, string | undefined>;
} & FlexProps) {
  return (
    <TxListTabsBase
      confirmedList={
        <ConfirmedTxsList
          filters={filters}
          limit={limit}
          showFilterButton={showFilterButton}
          showValueMenu={showValueMenu}
        />
      }
      mempoolList={
        <MempoolTxsList
          limit={limit}
          showFilterButton={showFilterButton}
          showValueMenu={showValueMenu}
        />
      }
      showFilterButton={showFilterButton}
      showValueMenu={showValueMenu}
      {...props}
    />
  );
}
