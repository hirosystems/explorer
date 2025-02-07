import { capitalize } from '@/common/utils/utils';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';

import { FilterTriggerText } from '../FilterTriggerText';

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
    <FilterTriggerText
      prefix={triggerTextPrefix}
      value={areFiltersActive ? triggerTextSuffix : ''}
      open={open}
    />
  );
}
