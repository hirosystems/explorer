import { capitalize } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

import { useTxTableFilters } from '../../TxTableFilterContext';

export function TransactionTypeFilterTriggerTextMobile({ open }: { open: boolean }) {
  const { filters } = useTxTableFilters() || {};
  const transactionTypes = filters?.transactionTypes || [];
  if (!transactionTypes) {
    return null;
  }

  const areFiltersActive = transactionTypes.length > 0;
  const triggerTextPrefix = areFiltersActive ? 'Type:' : 'Type';
  const firstActiveFilter = transactionTypes[0];
  const firstActiveFilterFormatted = firstActiveFilter ? firstActiveFilter.replace(/_/g, ' ') : '';
  const otherActiveFilters = transactionTypes.slice(1);
  const triggerTextSuffix =
    transactionTypes.length > 1
      ? `${capitalize(firstActiveFilterFormatted)}, +${otherActiveFilters.length}`
      : capitalize(firstActiveFilterFormatted);

  return (
    <Flex gap={1}>
      <Text
        textStyle="text-medium-sm"
        color={open ? 'textPrimary' : 'textSecondary'}
        _groupHover={{ color: 'textPrimary' }}
      >
        {triggerTextPrefix}
      </Text>
      {areFiltersActive && (
        <Text textStyle="text-medium-sm" color="textPrimary">
          {triggerTextSuffix}
        </Text>
      )}
    </Flex>
  );
}
