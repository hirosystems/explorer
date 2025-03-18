'use client';

import { AddressFilter } from '@/common/components/table/AddressFilter';
import { DateFilter } from '@/common/components/table/DateFilter';
import { TransactionTypeFilter } from '@/common/components/table/TransactionTypeFilter';
import { ValueBasisFilter } from '@/common/components/table/ValueBasisFilter';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

export const TxTableFilters = () => {
  return (
    <Flex justifyContent={'space-between'} flexWrap={'wrap'} gap={4} h={7}>
      <Flex gap={2} alignItems={'center'} h="full">
        <Text textStyle="text-regular-sm" color="textSecondary">
          Filter:
        </Text>
        <Flex gap={3}>
          <AddressFilter />
          <DateFilter />
          <TransactionTypeFilter />
        </Flex>
      </Flex>
      <Flex gap={4} h="full">
        <Flex gap={2} alignItems={'center'}>
          <Text textStyle="text-regular-sm" color="textSecondary">
            Show:
          </Text>
          <ValueBasisFilter />
        </Flex>
      </Flex>
    </Flex>
  );
};
