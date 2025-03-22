'use client';

import { AddressFilterPopover } from '@/common/components/table/address-filter/AddressFilterPopover';
import { DateFilterPopover } from '@/common/components/table/date-filter/DateFilterPopover';
import { TransactionTypeFilterPopover } from '@/common/components/table/transaction-type-filter/TransactionTypeFilterPopover';
import { ValueBasisFilterPopover } from '@/common/components/table/value-basis-filter/ValueBasisPopover';
import { MODALS } from '@/common/constants/constants';
import { useAppDispatch } from '@/common/state/hooks';
import { Button } from '@/components/ui/button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { Funnel } from '@phosphor-icons/react';

import { openModal } from '../modals/modal-slice';
import { TxPageFilters } from '@/app/transactions/page';

export const TxTableFilters = ({ filters }: { filters: TxPageFilters }) => {
  const dispatch = useAppDispatch();
  const { fromAddress, toAddress, startTime, endTime } = filters;

  return (
    <Flex justifyContent={'space-between'} flexWrap={'wrap'} gap={4}>
      <Button
        display={{ base: 'flex', md: 'none' }}
        onClick={() => dispatch(openModal(MODALS.TxsTableFilters))}
        variant="redesignTertiary"
        size="small"
        w="full"
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
          <AddressFilterPopover defaultFromAddress={fromAddress} defaultToAddress={toAddress} />
          <DateFilterPopover defaultStartTime={startTime} defaultEndTime={endTime} />
          <TransactionTypeFilterPopover />
        </Flex>
      </Flex>
      <Flex gap={4} h="full">
        <Flex gap={2} alignItems={'center'}>
          <Text textStyle="text-regular-sm" color="textSecondary">
            Show:
          </Text>
          <ValueBasisFilterPopover />
        </Flex>
      </Flex>
    </Flex>
  );
};
