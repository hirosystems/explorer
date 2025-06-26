import {
  FilterTabPopover,
  getFilterTabPopoverContainerProps,
} from '@/common/components/table/filters/FilterTabPopover';
import { Box } from '@chakra-ui/react';

import { TransactionEventType } from '@stacks/stacks-blockchain-api-types';

import { EventAssetTypeFilterForm } from './EventAssetTypeFilterForm';
import { EventAssetTypeFilterTrigger } from './EventAssetTypeFilterTrigger';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function EventAssetTypeFilterPopover({
  idExtension = '',
  defaultEventAssetTypes = [],
  eventAssetTypeFilterHandler,
}: {
  idExtension?: string;
  defaultEventAssetTypes?: TransactionEventType[];
  eventAssetTypeFilterHandler: (eventAssetTypes?: TransactionEventType[]) => void;
}) {
  return (
    <FilterTabPopover
      id={`event-type-filter-popover${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <EventAssetTypeFilterTrigger
          open={open}
          eventAssetTypes={defaultEventAssetTypes}
          setOpen={setOpen}
          eventAssetTypeFilterHandler={eventAssetTypeFilterHandler}
          filterContainerProps={getFilterTabPopoverContainerProps}
        />
      )}
      content={(open, setOpen) => (
        <Box px={1.5} pt={2} pb={3}>
          <EventAssetTypeFilterForm
            onSubmit={(eventAssetTypes: TransactionEventType[]) => {
              setOpen(false);
              eventAssetTypeFilterHandler(eventAssetTypes);
            }}
            open={open}
            defaultEventAssetTypes={defaultEventAssetTypes}
          />
        </Box>
      )}
    />
  );
}
