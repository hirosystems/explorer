import { capitalize } from '@/common/utils/utils';

import { FilterTriggerText } from '../FilterTriggerText';

export function TransactionTypeFilterTriggerText({
  open,
  defaultTransactionType,
}: {
  open: boolean;
  defaultTransactionType: string[] | undefined;
}) {
  const transactionType = defaultTransactionType || [];
  const areFiltersActive = transactionType.length > 0;
  const triggerTextPrefix = areFiltersActive ? 'Type:' : 'Type';
  const firstActiveFilter = transactionType?.[0];
  const firstActiveFilterFormatted = firstActiveFilter
    ? capitalize(firstActiveFilter.replace(/_/g, ' '))
    : '';
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
