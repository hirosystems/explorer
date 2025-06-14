import { Box } from '@chakra-ui/react';

import { FilterTabPopover, getFilterTabPopoverContainerProps } from '../FilterTabPopover';
import { DateFilterTabs } from './DateFilterTabs';
import { DateFilterTrigger } from './DateFilterTrigger';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function DateFilterPopover({
  idExtension = '',
  defaultStartTime = '',
  defaultEndTime = '',
  clearFilterHandler,
  onSubmit,
}: {
  idExtension?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  clearFilterHandler: () => void;
  onSubmit: (startTime?: number, endTime?: number) => void;
}) {
  return (
    <FilterTabPopover
      id={`date-filter-popover${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <DateFilterTrigger
          open={open}
          setOpen={setOpen}
          startTime={defaultStartTime}
          endTime={defaultEndTime}
          clearFilterHandler={clearFilterHandler}
          filterContainerProps={getFilterTabPopoverContainerProps}
        />
      )}
      content={(open, setOpen) => (
        <Box p={3}>
          <DateFilterTabs
            onSubmit={(startTime?: number, endTime?: number) => {
              onSubmit(startTime, endTime);
              setOpen(false);
            }}
            defaultStartTime={defaultStartTime}
            defaultEndTime={defaultEndTime}
          />
        </Box>
      )}
    />
  );
}
