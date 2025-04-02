import {
  FilterTrigger,
  FilterTriggerContainerProps,
} from '@/common/components/table/filters/FilterTrigger';
import { useCallback } from 'react';

import { TransactionEventType } from '@stacks/stacks-blockchain-api-types';

import { EventAssetTypeFilterLabel } from './useEventsTableFilters';

export function EventAssetTypeFilterTrigger({
  open,
  eventAssetTypes,
  setOpen,
  eventAssetTypeFilterHandler,
  filterContainerProps,
}: {
  open: boolean;
  eventAssetTypes: TransactionEventType[];
  setOpen: (open: boolean) => void;
  eventAssetTypeFilterHandler: (eventAssetTypes?: TransactionEventType[]) => void;
  filterContainerProps: FilterTriggerContainerProps;
}) {
  const isFilterActive = eventAssetTypes.length > 0;
  const triggerTextPrefix = isFilterActive ? 'Asset Type:' : 'Asset Type';
  const triggerTextSuffix =
    eventAssetTypes.length > 1
      ? `${EventAssetTypeFilterLabel[eventAssetTypes[0]]}, +${eventAssetTypes.length - 1}`
      : EventAssetTypeFilterLabel[eventAssetTypes[0]];

  const handleClearFilter = useCallback(() => {
    eventAssetTypeFilterHandler(undefined);
    setOpen?.(false);
  }, [eventAssetTypeFilterHandler, setOpen]);

  return (
    <FilterTrigger
      prefix={triggerTextPrefix}
      value={isFilterActive ? triggerTextSuffix : ''}
      open={open}
      clearFilterHandler={handleClearFilter}
      containerProps={filterContainerProps}
    />
  );
}
