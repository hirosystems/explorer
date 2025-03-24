import { truncateMiddle, truncateStxAddress, validateStacksAddress } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useTxTableFilters } from '../../TxTableFilterContext';

const TRUNCATE_THRESHOLD = 15;

export const AddressFilterTriggerTextMobile = ({
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

  const { filters } = useTxTableFilters() || {};

  useEffect(() => {
    const { fromAddress: contextFromAddress, toAddress: contextToAddress } =
      filters?.addresses || {};
    setFromAddress(contextFromAddress || '');
    setToAddress(contextToAddress || '');
  }, [filters]);

  if (fromAddress || toAddress) {
    return (
      <Flex gap={1.5}>
        {fromAddress && (
          <Flex gap={1}>
            <Text
              textStyle="text-medium-sm"
              color={open ? 'textPrimary' : 'textSecondary'}
              _groupHover={{ color: 'textPrimary' }}
            >
              From:
            </Text>
            <Text textStyle="text-medium-sm" color="textPrimary">
              {validateStacksAddress(fromAddress)
                ? truncateStxAddress(fromAddress)
                : fromAddress.length > TRUNCATE_THRESHOLD
                  ? truncateMiddle(fromAddress, 4, 5)
                  : fromAddress}
            </Text>
          </Flex>
        )}
        {toAddress && (
          <Flex gap={1}>
            <Text
              textStyle="text-medium-sm"
              color={open ? 'textPrimary' : 'textSecondary'}
              _groupHover={{ color: 'textPrimary' }}
            >
              To:
            </Text>
            <Text textStyle="text-medium-sm" color="textPrimary">
              {validateStacksAddress(toAddress)
                ? truncateStxAddress(toAddress)
                : toAddress.length > TRUNCATE_THRESHOLD
                  ? truncateMiddle(toAddress, 4, 5)
                  : toAddress}
            </Text>
          </Flex>
        )}
      </Flex>
    );
  }

  return (
    <Text
      textStyle="text-medium-sm"
      color={open ? 'textPrimary' : 'textSecondary'}
      _groupHover={{ color: 'textPrimary' }}
    >
      From/To
    </Text>
  );
};
