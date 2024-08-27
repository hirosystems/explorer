'use client';

import React from 'react';

import { TokenPrice } from '../../common/types/tokenPrice';
import { TxListTabs } from '../../features/txs-list/tabs/TxListTabs';
import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';
import { FilterProps } from '../search/filters';
import { MempoolFeeStatsWithErrorBoundary } from './MempoolFeeStats';

export default function ({ tokenPrice, filters }: { tokenPrice: TokenPrice } & FilterProps) {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex>
      <MempoolFeeStatsWithErrorBoundary tokenPrice={tokenPrice} />
      <TxListTabs filters={filters} />
    </>
  );
}
