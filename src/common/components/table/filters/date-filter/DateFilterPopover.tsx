import { Box } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { DateFilterTabs } from './DateFilterTabs';
import { DateFilterTriggerText } from './DateFilterTriggerText';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function DateFilterPopover({
  idExtension = '',
  defaultStartTime = '',
  defaultEndTime = '',
  onSubmit,
}: {
  idExtension?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  onSubmit: (startTime?: number, endTime?: number) => void;
}) {
  return (
    <TableTabPopover
      id={`date-filter-popover${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <DateFilterTriggerText open={open} startTime={defaultStartTime} endTime={defaultEndTime} />
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
