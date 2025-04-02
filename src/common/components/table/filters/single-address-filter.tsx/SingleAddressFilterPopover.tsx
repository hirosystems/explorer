import { Box } from '@chakra-ui/react';

import { FilterTabPopover, getFilterTabPopoverContainerProps } from '../FilterTabPopover';
import { SingleAddressFilterForm } from './SingleAddressFilterForm';
import { SingleAddressFilterTrigger } from './SingleAddressFilterTrigger';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function SingleAddressFilterPopover({
  idExtension = '',
  defaultAddress = '',
  addressFilterHandler,
}: {
  idExtension?: string;
  defaultAddress?: string;
  addressFilterHandler: (address?: string) => void;
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
        <SingleAddressFilterTrigger
          setOpen={setOpen}
          open={open}
          address={defaultAddress}
          addressFilterHandler={addressFilterHandler}
          filterContainerProps={getFilterTabPopoverContainerProps}
        />
      )}
      content={(open, setOpen) => (
        <Box p={3}>
          <SingleAddressFilterForm
            onSubmit={(address: string) => {
              addressFilterHandler(address);
              setOpen(false);
            }}
            defaultAddress={defaultAddress}
          />
        </Box>
      )}
    />
  );
}
