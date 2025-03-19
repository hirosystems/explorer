import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu';
import { Text } from '@/ui/Text';
import { Icon } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';

import { Timeframe, useNetworkOverviewContext } from './NetworkOverviewContextProvider';

export function TimeframeSelector() {
  const { selectedTimeframe, setSelectedTimeframe } = useNetworkOverviewContext();
  return (
    <MenuRoot variant="redesignPrimary">
      <MenuTrigger
        type="button"
        onClick={e => {
          e.stopPropagation();
        }}
        minWidth={40}
      >
        <Text>{selectedTimeframe}</Text>
        <Icon>
          <CaretDown />
        </Icon>
      </MenuTrigger>
      <MenuContent minWidth={40}>
        {Object.values(Timeframe).map(timeframe => (
          <MenuItem
            key={timeframe}
            value={timeframe as string}
            onClick={() => setSelectedTimeframe(timeframe)}
          >
            {timeframe}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}
