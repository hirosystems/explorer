import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { Text } from '@components/typography';
import { Popover } from '@components/popover/popover';
import { NetworkOptions } from '@store/ui';
import { selectNetwork } from '@store/ui/actions';
import { selectCurrentNetwork } from '@store/ui/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { useToast } from '@common/hooks/use-toast';
import { IS_DEV } from '@common/constants';
import { NETWORK_COOKIE, networkStorage } from '@common/utils';

export const TestnetSelector = (props: BoxProps) => {
  const ref = React.useRef(null);
  const { addPositiveToast } = useToast();
  const { selected } = useSelector((state: RootState) => ({
    selected: selectCurrentNetwork(state),
  }));

  const dispatch = useDispatch();

  const handleSelectApiServer = ({ value }: { value: NetworkOptions }) => {
    dispatch(selectNetwork(value));
    networkStorage.set(NETWORK_COOKIE, value);
    addPositiveToast({
      message: 'Network changed!',
      description: `You are now using the ${value.toLowerCase()} server.`,
    });
  };

  const items = [
    { label: 'Testnet', value: 'TESTNET' },
    { label: 'Mocknet', value: 'MOCKNET' },
  ];

  if (IS_DEV) {
    items.push({
      label: 'Localhost',
      value: 'LOCAL',
    });
  }

  const activeItem = items.findIndex(item => item.value === selected);

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
      >
        <Box
          _hover={{
            cursor: 'pointer',
          }}
          ref={ref}
        >
          <Text>{items[activeItem].label}</Text>
        </Box>
      </Popover>
    </Box>
  );
};
