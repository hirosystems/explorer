import { truncateMiddle, truncateStxAddress, validateStacksAddress } from '@/common/utils/utils';
import { Flex } from '@chakra-ui/react';
import { useCallback } from 'react';

import { FilterTrigger, FilterTriggerContainerProps } from '../FilterTrigger';

const TRUNCATE_THRESHOLD = 15;

export const AddressFilterTrigger = ({
  setOpen,
  toAddress,
  fromAddress,
  open,
  addressFilterHandler,
  filterContainerProps,
}: {
  setOpen: (open: boolean) => void;
  toAddress?: string;
  fromAddress?: string;
  open: boolean;
  addressFilterHandler: (fromAddress?: string, toAddress?: string) => void;
  filterContainerProps: FilterTriggerContainerProps;
}) => {
  const handleClearFilter = useCallback(() => {
    addressFilterHandler(undefined, undefined);
    setOpen?.(false);
  }, [addressFilterHandler, setOpen]);

  if (fromAddress || toAddress) {
    return (
      <Flex gap={1.5} w="full">
        {fromAddress && (
          <FilterTrigger
            prefix="From:"
            value={
              validateStacksAddress(fromAddress)
                ? truncateStxAddress(fromAddress)
                : fromAddress.length > TRUNCATE_THRESHOLD
                  ? truncateMiddle(fromAddress, 4, 5)
                  : fromAddress
            }
            open={open}
            setOpen={setOpen}
            clearFilterHandler={handleClearFilter}
            containerProps={filterContainerProps}
          />
        )}
        {toAddress && (
          <FilterTrigger
            prefix="To:"
            value={
              validateStacksAddress(toAddress)
                ? truncateStxAddress(toAddress)
                : toAddress.length > TRUNCATE_THRESHOLD
                  ? truncateMiddle(toAddress, 4, 5)
                  : toAddress
            }
            open={open}
            setOpen={setOpen}
            clearFilterHandler={handleClearFilter}
            containerProps={filterContainerProps}
          />
        )}
      </Flex>
    );
  }

  return (
    <FilterTrigger
      prefix="From/To"
      value=""
      open={open}
      setOpen={setOpen}
      clearFilterHandler={handleClearFilter}
      containerProps={filterContainerProps}
    />
  );
};
