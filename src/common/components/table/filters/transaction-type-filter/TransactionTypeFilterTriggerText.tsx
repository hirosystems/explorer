import { capitalize } from '@/common/utils/utils';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

export function TransactionTypeFilterTriggerText({ open }: { open: boolean }) {
  const { activeFilters } = useFilterAndSortState();

  const areFiltersActive = activeFilters.length > 0;
  const triggerTextPrefix = areFiltersActive ? 'Type:' : 'Type';
  const firstActiveFilter = activeFilters[0];
  const firstActiveFilterFormatted = firstActiveFilter ? firstActiveFilter.replace(/_/g, ' ') : '';
  const otherActiveFilters = activeFilters.slice(1);
  const triggerTextSuffix =
    activeFilters.length > 1
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
