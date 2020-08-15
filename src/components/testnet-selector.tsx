import React from 'react';
import { Flex, Box, BoxProps } from '@stacks/ui';
import { ChevronDown } from '@components/icons/chevron-down';
import { Popover } from '@components/popover/popover';
import { NetworkOptions } from '@store/ui';
import { selectNetwork } from '@store/ui/actions';

import { useDispatch } from 'react-redux';
import { useConfigState } from '@common/hooks/use-config-state';
import { useToast } from '@common/hooks/use-toast';
import { IS_DEV } from '@common/constants';
import { NETWORK_COOKIE, networkStorage } from '@common/utils';
import { color } from '@components/color-modes';
import { HeaderTextItem } from '@components/header';

export const TestnetSelector = (props: BoxProps) => {
  const ref = React.useRef<any | null>(null);
  const { addPositiveToast } = useToast();
  const { selectedNetwork, isStaging } = useConfigState();

  const dispatch = useDispatch();

  const handleSelectApiServer = ({ value }: { value: NetworkOptions }) => {
    dispatch(selectNetwork(value));
    networkStorage.set(NETWORK_COOKIE, value);
    addPositiveToast({
      message: 'Network changed!',
      description: `You are now using the ${value.toLowerCase()} server.`,
    });
  };

  const items = [{ label: 'Testnet', value: 'TESTNET' }];

  if (IS_DEV || isStaging) {
    items.push({ label: 'Mocknet', value: 'MOCKNET' });
    items.push({
      label: 'Localhost',
      value: 'LOCAL',
    });
  }

  const activeItem = items.findIndex(item => item.value === selectedNetwork);

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
