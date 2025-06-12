import { getTxTypeLabel } from '@/common/utils/transactions';

import { FilterTrigger } from '../FilterTrigger';

export function TransactionTypeFilterTrigger({
  open,
  setOpen,
  transactionType,
  clearFilterHandler,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionType: string[];
  clearFilterHandler: () => void;
}) {
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
    <FilterTrigger
      setOpen={setOpen}
      prefix={triggerTextPrefix}
      value={areFiltersActive ? triggerTextSuffix : ''}
      open={open}
      clearFilterHandler={clearFilterHandler}
    />
  );
}
