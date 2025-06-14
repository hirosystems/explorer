import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';

import { areAnyTxTableFiltersActive } from './tx-table-filters-utils';

export function ClearTxTableFiltersButton() {
  const { transactionType, fromAddress, toAddress, startTime, endTime, clearAllFiltersHandler } =
    useTxTableFilters();

  if (
    !areAnyTxTableFiltersActive({
      transactionType,
      fromAddress,
      toAddress,
      startTime,
      endTime,
    })
  ) {
    return null;
  }

  return (
    <Button
      borderRadius="redesign.lg"
      py={1}
      px={3}
      onClick={clearAllFiltersHandler}
      variant="redesignTertiary"
      size="small"
      boxSizing="border-box"
      alignItems="center"
      h="full"
    >
      <Flex gap={1.5} alignItems={'center'}>
        <Text textStyle="text-medium-sm" color="textSecondary">
          Clear all filters
        </Text>
        <Icon h={3} w={3} color="iconSecondary">
          <X />
        </Icon>
      </Flex>
    </Button>
  );
}
