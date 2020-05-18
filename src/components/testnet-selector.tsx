import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { Text } from '@components/typography';
import { Popover } from '@components/popover/popover';
import { NetworkOptions } from '@store/ui';
import { selectNetwork } from '@store/ui/actions';

import { useDispatch } from 'react-redux';
import { useConfigState } from '@common/hooks/use-config-state';
import { useToast } from '@common/hooks/use-toast';
import { IS_DEV } from '@common/constants';
import { NETWORK_COOKIE, networkStorage } from '@common/utils';

export const TestnetSelector = (props: BoxProps) => {
  const ref = React.useRef<any | null>(null);
  const { addPositiveToast } = useToast();
  const { selectedNetwork } = useConfigState();

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

  if (IS_DEV) {
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
        <Box
          _hover={{
            cursor: items?.length < 2 ? 'unset' : 'pointer',
          }}
          ref={ref}
        >
          <Text>{items[activeItem].label}</Text>
        </Box>
      </Popover>
    </Box>
  );
};
