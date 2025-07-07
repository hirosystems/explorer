import { getTxTypeLabel } from '@/common/utils/transactions';
import { useCallback } from 'react';

import { FilterTrigger, FilterTriggerContainerProps } from '../FilterTrigger';

export function TransactionTypeFilterTrigger({
  open,
  setOpen,
  transactionType,
  transactionTypeFilterHandler,
  filterContainerProps,
}: {
  open: boolean;
  setOpen?: (open: boolean) => void;
  transactionType: string[];
  transactionTypeFilterHandler: (transactionType?: string[]) => void;
  filterContainerProps: FilterTriggerContainerProps;
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

  const handleClearFilter = useCallback(() => {
    transactionTypeFilterHandler(undefined);
    setOpen?.(false);
  }, [transactionTypeFilterHandler, setOpen]);

  return (
    <FilterTrigger
      setOpen={setOpen}
      prefix={triggerTextPrefix}
      value={areFiltersActive ? triggerTextSuffix : ''}
      open={open}
      clearFilterHandler={handleClearFilter}
      containerProps={filterContainerProps}
    />
  );
}
