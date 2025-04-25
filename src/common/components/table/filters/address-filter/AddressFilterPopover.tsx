import { Box } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { AddressFilterForm } from './AddressFilterForm';
import { AddressFilterTriggerText } from './AddressFilterTriggerText';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function AddressFilterPopover({
  idExtension = '',
  defaultFromAddress = '',
  defaultToAddress = '',
  onSubmit,
}: {
  idExtension?: string;
  defaultFromAddress?: string;
  defaultToAddress?: string;
  onSubmit: (fromAddress: string, toAddress: string) => void;
}) {
  return (
    <TableTabPopover
      id={`address-filter-popover${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <AddressFilterTriggerText
          open={open}
          fromAddress={defaultFromAddress}
          toAddress={defaultToAddress}
        />
      )}
      content={(open, setOpen) => (
        <Box p={3}>
          <AddressFilterForm
            onSubmit={(fromAddress: string, toAddress: string) => {
              onSubmit(fromAddress, toAddress);
              setOpen(false);
            }}
            defaultFromAddress={defaultFromAddress}
            defaultToAddress={defaultToAddress}
          />
        </Box>
      )}
    />
  );
}
