import React from 'react';
import { Flex, Box, BoxProps } from '@stacks/ui';
import { ChevronDown } from '@components/icons/chevron-down';
import { Popover } from '@components/popover/popover';

import { IS_DEV } from '@common/constants';
import { NETWORK_COOKIE, networkStorage } from '@common/utils';

import { HeaderTextItem } from '@components/header';
import { useApiServer } from '@common/hooks/use-api';
export type NetworkOptions = 'MOCKNET' | 'TESTNET' | 'LOCAL';

export const TestnetSelector = (props: BoxProps) => {
  const ref = React.useRef<any | null>(null);
  const apiServer = useApiServer();
  const handleSelectApiServer = ({ value }: { value: NetworkOptions }) => {
    networkStorage.set(NETWORK_COOKIE, value);
  };

  const items = [{ label: 'Testnet', value: 'TESTNET' }];

  if (IS_DEV) {
    items.push({ label: 'Mocknet', value: 'MOCKNET' });
    items.push({
      label: 'Localhost',
      value: 'LOCAL',
    });
  }

  const activeItem = items.findIndex(item => item.value === apiServer);

  return (
    <Box {...props}>
      <Popover
        items={items}
        activeItem={activeItem}
        triggerRef={ref}
        wrapperProps={{
          minWidth: '180px',
        }}
        placement="right"
        onItemClick={handleSelectApiServer}
        hideItems={items?.length < 2}
      >
        <Flex
          _hover={{
            cursor: items?.length < 2 ? 'unset' : 'pointer',
          }}
          ref={ref}
          alignItems="center"
        >
          <HeaderTextItem>{items[activeItem].label}</HeaderTextItem>
          <ChevronDown opacity={0.8} ml="extra-tight" color="white" strokeWidth={2} size={'14px'} />
        </Flex>
      </Popover>
    </Box>
  );
};
