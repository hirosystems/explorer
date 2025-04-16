import { Box, PopoverTriggerProps } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { TransactionTypeFilterForm } from './TransactionTypeFilterForm';
import { TransactionTypeFilterTriggerText } from './TransactionTypeFilterTriggerText';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function TransactionTypeFilterPopover() {
  return (
    <TableTabPopover
      id={'transaction-type-filter-popover'}
      positioning={{ placement: 'bottom-start', offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT } }}
      trigger={(open, setOpen) => <TransactionTypeFilterTriggerText open={open} />}
      content={(open, setOpen) => (
        <Box px={1.5} pt={2} pb={3}>
          <TransactionTypeFilterForm
            onSubmit={() => {
              setOpen(false);
            }}
            open={open}
          />
        </Box>
      )}
    />
  );
}
