'use client';

import { AddressFilter } from '@/common/components/table/AddressFilter';
import { DateFilter } from '@/common/components/table/DateFilter';
import { ValueBasisFilter } from '@/common/components/table/ValueBasisFilter';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { isRedesignUrl } from '@/common/utils/url-utils';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { TokenPrice } from '../../common/types/tokenPrice';
import { FilterProps } from '../search/filters';
import { MempoolFeeStatsSkeleton } from './skeleton';

const MempoolFeeStatsDynamic = dynamic(
  () => import('./MempoolFeeStats').then(mod => mod.MempoolFeeStats),
  {
    loading: () => <MempoolFeeStatsSkeleton />,
    ssr: false,
  }
);

export default function ({ tokenPrice, filters }: { tokenPrice: TokenPrice } & FilterProps) {
  const isRedesign = isRedesignUrl();

  // TODO: set filters in redux
  return (
    <>
      {/* <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex> */}
      {/* <MempoolFeeStatsDynamic tokenPrice={tokenPrice} />
      <TxListTabs filters={filters} /> */}
      <Flex justifyContent={'space-between'} flexWrap={'wrap'} gap={4} h={7}>
        <Flex gap={2} alignItems={'center'} h='full'>
          <Text textStyle="text-regular-sm" color="textSecondary">
            Filter:
          </Text>
          <Flex gap={3}>
            <AddressFilter />
            <DateFilter />
            <TransactionTypeFilter />
          </Flex>
        </Flex>
        <Flex gap={4} h='full'>
          <Flex gap={2} alignItems={'center'}>
            <Text textStyle="text-regular-sm" color="textSecondary">
              Show:
            </Text>
            <ValueBasisFilter />
          </Flex>
          {/* <Flex gap={2} alignItems={'center'}>
            <Text textStyle="text-regular-sm" color="textSecondary">
              Sort by:
            </Text>
            <ValueBasisFilter />
          </Flex> */}
        </Flex>
      </Flex>
      <TxsTable />
      {/* <ClientOnly>{isRedesign ? <TxsTable /> : null}</ClientOnly> */}
    </>
  );
}
