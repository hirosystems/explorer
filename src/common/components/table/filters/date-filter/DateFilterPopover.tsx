import { Box } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { useSearchParamsFilters } from '../search-param-filter-utils';
import { DateFilterTabs } from './DateFilterTabs';
import { DateFilterTriggerText } from './DateFilterTriggerText';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function DateFilterPopover() {
  const { startTime, endTime } = useSearchParamsFilters();

  return (
    <TableTabPopover
      id={'date-filter-popover-redesign'}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <DateFilterTriggerText open={open} startTime={startTime} endTime={endTime} />
      )}
      content={(open, setOpen) => (
        <Box p={3}>
          <DateFilterTabs
            onSubmit={() => setOpen(false)}
            defaultStartTime={startTime}
            defaultEndTime={endTime}
          />
        </Box>
      )}
    />
  );
}
