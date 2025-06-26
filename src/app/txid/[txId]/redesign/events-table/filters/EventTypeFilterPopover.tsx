import { Box } from '@chakra-ui/react';

import { TransactionEventAssetType } from '@stacks/stacks-blockchain-api-types';

import { EventTypeFilterForm } from './EventTypeFilterForm';
import { EventTypeFilterTriggerText } from './EventTypeFilterTriggerText';
import { TableTabPopover } from '@/common/components/table/filters/TableTabPopover';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function EventTypeFilterPopover({
  idExtension = '',
  defaultEventTypes = [],
  onSubmit,
}: {
  idExtension?: string;
  defaultEventTypes?: TransactionEventAssetType[];
  onSubmit: (eventTypes: TransactionEventAssetType[]) => void;
}) {
  return (
    <TableTabPopover
      id={`event-type-filter-popover${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <EventTypeFilterTriggerText open={open} eventTypes={defaultEventTypes} />
      )}
      content={(open, setOpen) => (
        <Box px={1.5} pt={2} pb={3}>
          <EventTypeFilterForm
            onSubmit={(eventTypes: TransactionEventAssetType[]) => {
              setOpen(false);
              onSubmit(eventTypes);
            }}
            open={open}
            defaultEventTypes={defaultEventTypes}
          />
        </Box>
      )}
    />
  );
}
