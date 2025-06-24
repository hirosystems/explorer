import { Box } from '@chakra-ui/react';

import { FilterTabPopover, getFilterTabPopoverContainerProps } from '../FilterTabPopover';
import { AddressFilterForm } from './AddressFilterForm';
import { AddressFilterTrigger } from './AddressFilterTrigger';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function AddressFilterPopover({
  idExtension = '',
  defaultFromAddress = '',
  defaultToAddress = '',
  addressFilterHandler,
}: {
  idExtension?: string;
  defaultFromAddress?: string;
  defaultToAddress?: string;
  addressFilterHandler: (fromAddress?: string, toAddress?: string) => void;
}) {
  return (
    <FilterTabPopover
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
          addressFilterHandler={addressFilterHandler}
          filterContainerProps={getFilterTabPopoverContainerProps}
        />
      )}
      content={(open, setOpen) => (
        <Box p={3}>
          <AddressFilterForm
            onSubmit={(fromAddress: string, toAddress: string) => {
              addressFilterHandler(fromAddress, toAddress);
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
