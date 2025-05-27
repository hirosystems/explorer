import { getTxTypeLabel } from '@/common/utils/transactions';

import { FilterTriggerText } from '../FilterTriggerText';
import { useSearchParamsFilters } from '../search-param-filter-utils';

export function TransactionTypeFilterTriggerText({ open }: { open: boolean }) {
  const { transactionType } = useSearchParamsFilters();
  // const transactionType = defaultTransactionType || [];
  const areFiltersActive = transactionType.length > 0;
  const triggerTextPrefix = areFiltersActive ? 'Type:' : 'Type';
  const firstActiveFilter = transactionType?.[0];
  const firstActiveFilterFormatted = firstActiveFilter ? getTxTypeLabel(firstActiveFilter) : '';
  const otherActiveFilters = transactionType?.slice(1);
  const triggerTextSuffix =
    transactionType?.length > 1
      ? `${firstActiveFilterFormatted}, +${otherActiveFilters.length}`
      : firstActiveFilterFormatted;

  return (
    <FilterTriggerText
      prefix={triggerTextPrefix}
      value={areFiltersActive ? triggerTextSuffix : ''}
      open={open}
    />
  );
}
