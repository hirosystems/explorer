import { Box } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { DateFilterTabs } from './DateFilterTabs';
import { DateFilterTriggerText } from './DateFilterTriggerText';

interface DateFilterProps {
  defaultStartTime?: string;
  defaultEndTime?: string;
}

const TAB_HEIGHT_ADJUSTMENT = 4;

export function DateFilterPopover({ defaultStartTime, defaultEndTime }: DateFilterProps) {
  return (
    <TableTabPopover
      id={'date-filter-popover-redesign'}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <DateFilterTriggerText
          defaultStartTime={defaultStartTime}
          defaultEndTime={defaultEndTime}
          open={open}
        />
      )}
      content={(open, setOpen) => (
        <Box p={3}>
          <DateFilterTabs
            defaultStartTime={defaultStartTime}
            defaultEndTime={defaultEndTime}
            onSubmit={() => setOpen(false)}
          />
        </Box>
      )}
    />
  );
}
