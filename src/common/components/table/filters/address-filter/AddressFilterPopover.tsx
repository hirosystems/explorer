import { Box } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { AddressFilterForm } from './AddressFilterForm';
import { AddressFilterTrigger } from './AddressFilterTrigger';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function AddressFilterPopover({
  idExtension = '',
  defaultFromAddress = '',
  defaultToAddress = '',
  onSubmit,
  clearFilterHandler,
}: {
  idExtension?: string;
  defaultFromAddress?: string;
  defaultToAddress?: string;
  onSubmit: (fromAddress: string, toAddress: string) => void;
  clearFilterHandler: () => void;
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
        <AddressFilterTrigger
          setOpen={setOpen}
          open={open}
          fromAddress={defaultFromAddress}
          toAddress={defaultToAddress}
          clearFilterHandler={clearFilterHandler}
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
