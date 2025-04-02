import { truncateMiddle, truncateStxAddress, validateStacksAddress } from '@/common/utils/utils';
import { useCallback } from 'react';

import { FilterTrigger, FilterTriggerContainerProps } from '../FilterTrigger';

const TRUNCATE_THRESHOLD = 15;

export const SingleAddressFilterTrigger = ({
  setOpen,
  address,
  open,
  addressFilterHandler,
  filterContainerProps,
}: {
  setOpen: (open: boolean) => void;
  address?: string;
  open: boolean;
  addressFilterHandler: (address?: string) => void;
  filterContainerProps: FilterTriggerContainerProps;
}) => {
  const handleClearFilter = useCallback(() => {
    addressFilterHandler(undefined);
    setOpen?.(false);
  }, [addressFilterHandler, setOpen]);

  const triggerTextPrefix = address ? 'Address:' : 'Address';
  const triggerTextSuffix = address
    ? validateStacksAddress(address)
      ? truncateStxAddress(address)
      : address.length > TRUNCATE_THRESHOLD
        ? truncateMiddle(address, 4, 5)
        : address
    : '';

  return (
    <FilterTrigger
      prefix={triggerTextPrefix}
      value={triggerTextSuffix}
      open={open}
      setOpen={setOpen}
      clearFilterHandler={handleClearFilter}
      containerProps={filterContainerProps}
    />
  );
};
