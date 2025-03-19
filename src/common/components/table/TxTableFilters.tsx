'use client';

import { AddressFilter } from '@/common/components/table/AddressFilter';
import { TransactionTypeFilter } from '@/common/components/table/TransactionTypeFilter';
import { ValueBasisFilter } from '@/common/components/table/ValueBasisFilter';
import { DateFilter } from '@/common/components/table/date-filter/DateFilter';
import { MODALS } from '@/common/constants/constants';
import { Button } from '@/components/ui/button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { Funnel } from '@phosphor-icons/react';
import { useAppDispatch } from '@/common/state/hooks';
import { openModal } from '../modals/modal-slice';

export const TxTableFilters = ({ filters }: { filters: Record<string, string | undefined> }) => {
  const dispatch = useAppDispatch();

  return (
    <Flex justifyContent={'space-between'} flexWrap={'wrap'} gap={4}>
      <Button display={{ base: 'flex', md: 'none' }}
        onClick={() => dispatch(openModal(MODALS.TxsTableFilters))}
        variant="redesignTertiary"
        size="small"
        w='full'
      >
        <Flex gap={1.5} alignItems={'center'}>
          <Text textStyle="text-regular-sm" color="textSecondary">
            Filter
          </Text>
          <Icon h={3.5} w={3.5}>
            <Funnel />
          </Icon>
        </Flex>
      </Button>
      <Flex display={{ base: 'none', md: 'flex' }} gap={2} alignItems={'center'} h="full">
        <Text textStyle="text-regular-sm" color="textSecondary">
          Filter
        </Text>
        <Flex gap={3}>
          <AddressFilter
            defaultFromAddress={filters.fromAddress}
            defaultToAddress={filters.toAddress}
          />
          <DateFilter defaultStartTime={filters.startTime} defaultEndTime={filters.endTime} />
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
