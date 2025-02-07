'use client';

import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { TxListTabs } from '@/features/txs-list/tabs/TxListTabs';
import { Flex } from '@chakra-ui/react';

import { TokenPrice } from '../../common/types/tokenPrice';
import { PageTitle } from '../_components/PageTitle';
import { FilterProps } from '../search/filters';
import { MempoolFeeStatsWithErrorBoundary } from './MempoolFeeStats';

export default function ({ tokenPrice, filters }: { tokenPrice: TokenPrice } & FilterProps) {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex>
      <TxsTable />
      <MempoolFeeStatsWithErrorBoundary tokenPrice={tokenPrice} />
      <TxListTabs filters={filters} />
    </>
  );
}
