'use client';

import { AddressFilterPopover } from '@/common/components/table/filters/address-filter/AddressFilterPopover';
import { TransactionTypeFilterPopover } from '@/common/components/table/filters/transaction-type-filter/TransactionTypeFilterPopover';
import { ClearTxTableFiltersButton } from '@/common/components/table/tx-table/ClearTxTableFiltersButton';
import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';
import { MODALS } from '@/common/constants/constants';
import { useAppDispatch } from '@/common/state/hooks';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { Funnel } from '@phosphor-icons/react';

import { openModal } from '../../modals/modal-slice';

const MobileOpenFilterModalButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      display={{ base: 'flex', md: 'none' }}
      alignItems={'center'}
      py={1.5}
      px={4}
      onClick={() => dispatch(openModal(MODALS.TxsTableFilters))}
      variant="redesignTertiary"
      w="full"
      h={10}
    >
      <Flex gap={1.5} alignItems={'center'}>
        <Text textStyle="text-medium-sm" color="textSecondary">
          Filter
        </Text>
        <Icon h={3.5} w={3.5} color="iconSecondary">
          <Funnel weight="bold" />
        </Icon>
      </Flex>
    </Button>
  );
};

export const MempoolTableFilters = () => {
  const {
    transactionType,
    fromAddress,
    toAddress,
    addressFilterHandler,
    transactionTypeFilterHandler,
  } = useTxTableFilters();

  return (
    <Flex flexWrap={'wrap'} gap={4}>
      <MobileOpenFilterModalButton />
      <Flex display={{ base: 'none', md: 'flex' }} gap={3} alignItems={'center'} h="full">
        <Text textStyle="text-regular-sm" color="textSecondary">
          Filter:
        </Text>
        <Flex gap={3} h={7}>
          <TransactionTypeFilterPopover
            defaultTransactionType={transactionType}
            transactionTypeFilterHandler={transactionTypeFilterHandler}
          />
          <AddressFilterPopover
            defaultFromAddress={fromAddress}
            defaultToAddress={toAddress}
            addressFilterHandler={addressFilterHandler}
          />
          <ClearTxTableFiltersButton />
        </Flex>
      </Flex>
    </Flex>
  );
};
