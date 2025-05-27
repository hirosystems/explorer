import { Box } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { AddressFilterForm } from './AddressFilterForm';
import { AddressFilterTriggerText } from './AddressFilterTriggerText';
import { useSearchParamsFilters } from '../search-param-filter-utils';

interface AddressFilterPopoverProps {
  defaultFromAddress?: string;
  defaultToAddress?: string;
  idExtension?: string;
}

const TAB_HEIGHT_ADJUSTMENT = 4;

export function AddressFilterPopover({
  idExtension = '',
}: AddressFilterPopoverProps) {
  const { fromAddress: searchParamFromAddress, toAddress: searchParamToAddress } =
    useSearchParamsFilters();
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
          open={open}
          fromAddress={searchParamFromAddress}
          toAddress={searchParamToAddress}
        />
      )}
      content={(open, setOpen) => (
        <Box p={3}>
          <AddressFilterForm
            onSubmit={() => {
              setOpen(false);
            }}
            defaultFromAddress={searchParamFromAddress}
            defaultToAddress={searchParamToAddress}
          />
        </Box>
      )}
    />
  );
}
