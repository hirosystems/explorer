import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu';
import { Text } from '@/ui/Text';
import { Icon } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';

export enum Timeframe {
  last24h = 'Last 24hs',
  last7d = 'Last 7d',
  last30d = 'Last 30d',
  last360d = 'Last 360d',
  all = 'All',
}

interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe;
  setSelectedTimeframe: (timeframe: Timeframe) => void;
}

export function TimeframeSelector({
  selectedTimeframe: propsSelectedTimeframe,
  setSelectedTimeframe: propsSetSelectedTimeframe,
}: TimeframeSelectorProps) {
  const selectedTimeframe = propsSelectedTimeframe;
  const setSelectedTimeframe = propsSetSelectedTimeframe;

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
