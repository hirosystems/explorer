import React from 'react';
import { Box } from '@blockstack/ui';
import { Text } from '@components/typography';
import { Popover } from '@components/popover/popover';
import { NetworkOptions } from '@store/ui';
import { selectNetwork } from '@store/ui/actions';
import { selectCurrentNetwork } from '@store/ui/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';

export const TestnetSelector = () => {
  const ref = React.useRef(null);
  const { selected } = useSelector((state: RootState) => ({
    selected: selectCurrentNetwork(state),
  }));

  const dispatch = useDispatch();

  const handleSelectApiServer = ({ value }: { value: NetworkOptions }) => {
    dispatch(selectNetwork(value));
  };

  const items = [
    { label: 'Testnet', value: 'TESTNET' },
    { label: 'Mocknet', value: 'MOCKNET' },
  ];

  const activeItem = items.findIndex(item => item.value === selected);

  return (
    <Box ml="auto">
      <Popover
        items={items}
        activeItem={activeItem}
        triggerRef={ref}
        cardProps={{
          minWidth: '180px',
          textAlign: 'right',
          right: 0,
        }}
        onItemClick={handleSelectApiServer}
      >
        <Box
          _hover={{
            cursor: 'pointer',
          }}
          py="tight"
          ref={ref}
        >
          <Text>{items[activeItem].label}</Text>
        </Box>
      </Popover>
    </Box>
  );
};
