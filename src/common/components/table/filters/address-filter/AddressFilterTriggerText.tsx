import { truncateMiddle, truncateStxAddress, validateStacksAddress } from '@/common/utils/utils';
import { Flex } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { FilterTriggerText } from '../FilterTriggerText';

const TRUNCATE_THRESHOLD = 15;

export const AddressFilterTriggerText = ({
  defaultToAddress,
  defaultFromAddress,
  open,
}: {
  defaultToAddress?: string;
  defaultFromAddress?: string;
  open: boolean;
}) => {
  const [toAddress, setToAddress] = useState(defaultToAddress);
  const [fromAddress, setFromAddress] = useState(defaultFromAddress);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fromAddress = searchParams.get('fromAddress');
    const toAddress = searchParams.get('toAddress');
    setFromAddress(fromAddress || '');
    setToAddress(toAddress || '');
  }, [searchParams]);

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
