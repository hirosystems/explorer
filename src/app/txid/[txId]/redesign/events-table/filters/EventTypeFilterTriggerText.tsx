import { FilterTriggerText } from '@/common/components/table/filters/FilterTriggerText';

import { TransactionEventAssetType } from '@stacks/stacks-blockchain-api-types';

export function EventTypeFilterTriggerText({
  open,
  eventTypes,
}: {
  open: boolean;
  eventTypes: TransactionEventAssetType[];
}) {
  const isFilterActive = eventTypes.length > 0;
  const triggerTextPrefix = isFilterActive ? 'Event:' : 'Event';
  const triggerTextSuffix =
    eventTypes.length > 1 ? `${eventTypes[0]}, +${eventTypes.length - 1}` : eventTypes[0];

  return (
    <FilterTriggerText
      prefix={triggerTextPrefix}
      value={isFilterActive ? triggerTextSuffix : ''}
      open={open}
    />
  );
}
