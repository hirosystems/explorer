'use client';

import { TxPageFilters } from '@/app/transactions/page';
import { AddressFilterPopover } from '@/common/components/table/filters/address-filter/AddressFilterPopover';
import { DateFilterPopover } from '@/common/components/table/filters/date-filter/DateFilterPopover';
import { TransactionTypeFilterPopover } from '@/common/components/table/filters/transaction-type-filter/TransactionTypeFilterPopover';
import { ValueBasisFilterPopover } from '@/common/components/table/filters/value-basis-filter/ValueBasisPopover';
import { MODALS } from '@/common/constants/constants';
import { useAppDispatch } from '@/common/state/hooks';
import { Button } from '@/components/ui/button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { Funnel } from '@phosphor-icons/react';

import { openModal } from '../../modals/modal-slice';
import { ClearFiltersButton } from './ClearFiltersButton';

const MobileOpenFilterModalButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      display={{ base: 'flex', md: 'none' }}
      onClick={() => dispatch(openModal(MODALS.TxsTableFilters))}
      variant="redesignTertiary"
      size="big"
      w="full"
      h={10}
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
  );
};

export const TxTableFilters = ({ filters }: { filters: TxPageFilters }) => {
  const { fromAddress, toAddress, startTime, endTime } = filters;

  return (
    <Flex flexWrap={'wrap'} gap={4}>
      <MobileOpenFilterModalButton />
      <Flex display={{ base: 'none', md: 'flex' }} gap={2} alignItems={'center'} h="full">
        <Text textStyle="text-regular-sm" color="textSecondary">
          Filter:
        </Text>
        <Flex gap={3}>
          <TransactionTypeFilterPopover />
          <DateFilterPopover defaultStartTime={startTime} defaultEndTime={endTime} />
          <AddressFilterPopover defaultFromAddress={fromAddress} defaultToAddress={toAddress} />
          <ClearFiltersButton filters={filters} />
        </Flex>
      </Flex>
    </Flex>
  );
};
