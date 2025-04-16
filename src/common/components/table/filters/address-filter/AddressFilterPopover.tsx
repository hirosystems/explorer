import { Box } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { AddressFilterForm } from './AddressFilterForm';
import { AddressFilterTriggerText } from './AddressFilterTriggerText';

interface AddressFilterPopoverProps {
  defaultFromAddress?: string;
  defaultToAddress?: string;
  idExtension?: string;
}

const TAB_HEIGHT_ADJUSTMENT = 4;

export function AddressFilterPopover({
  defaultToAddress = '',
  defaultFromAddress = '',
  idExtension = '',
}: AddressFilterPopoverProps) {
  return (
    <TableTabPopover
      id={`address-filter-popover-redesign${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <AddressFilterTriggerText
          defaultFromAddress={defaultFromAddress}
          defaultToAddress={defaultToAddress}
          open={open}
        />
      )}
      content={(open, setOpen) => (
        <Box p={3}>
          <AddressFilterForm
            defaultFromAddress={defaultFromAddress}
            defaultToAddress={defaultToAddress}
            onSubmit={() => {
              setOpen(false);
            }}
          />
        </Box>
      )}
    />
  );
}
