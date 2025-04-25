import { truncateMiddle, truncateStxAddress, validateStacksAddress } from '@/common/utils/utils';
import { Flex } from '@chakra-ui/react';

import { FilterTriggerText } from '../FilterTriggerText';

const TRUNCATE_THRESHOLD = 15;

export const AddressFilterTriggerText = ({
  toAddress,
  fromAddress,
  open,
}: {
  toAddress?: string;
  fromAddress?: string;
  open: boolean;
}) => {
  if (fromAddress || toAddress) {
    return (
      <Flex gap={1.5}>
        {fromAddress && (
          <FilterTriggerText
            prefix="From:"
            value={
              validateStacksAddress(fromAddress)
                ? truncateStxAddress(fromAddress)
                : fromAddress.length > TRUNCATE_THRESHOLD
                  ? truncateMiddle(fromAddress, 4, 5)
                  : fromAddress
            }
            open={open}
          />
        )}
        {toAddress && (
          <FilterTriggerText
            prefix="To:"
            value={
              validateStacksAddress(toAddress)
                ? truncateStxAddress(toAddress)
                : toAddress.length > TRUNCATE_THRESHOLD
                  ? truncateMiddle(toAddress, 4, 5)
                  : toAddress
            }
            open={open}
          />
        )}
      </Flex>
    );
  }

  return <FilterTriggerText prefix="From/To" value="" open={open} />;
};
