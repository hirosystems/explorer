import { Box, BoxProps, color, Stack } from '@stacks/ui';
import * as React from 'react';
import { memo } from 'react';
import { useTabs } from '../hooks/use-tabs';
import { Caption } from '@components/typography';
import { capitalize } from '@common/utils';

interface TabProps extends BoxProps {
  tab: string;
  index: number;
  stateKey: string;
  defaultIndex?: number;
}

const Tab: React.FC<TabProps> = memo(({ tab, index, _hover = {}, stateKey, ...rest }) => {
  const { currentIndex, setCurrentIndex } = useTabs(stateKey);
  const isActive = index === currentIndex;
  const hoverProps = isActive
    ? {
        ..._hover,
      }
    : {
        cursor: 'pointer',
        color: color('brand'),
        ..._hover,
      };
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      outline={0}
      border={0}
      px="base-loose"
      onClick={() => setCurrentIndex(index)}
      color={isActive ? color('text-title') : color('text-caption')}
      _hover={hoverProps}
      position="relative"
      bg={isActive ? color('bg-4') : 'transparent'}
      py="base-tight"
      borderRadius="10px"
      {...rest}
    >
      <Caption opacity={isActive ? 1 : 0.85} fontSize={1} fontWeight={500} color="currentColor">
        {capitalize(tab)}
      </Caption>
    </Box>
  );
});

export const Tabs = memo(
  ({ tabs, stateKey }: { defaultIndex?: number; tabs: string[]; stateKey: string }) => {
    return (
      <Stack isInline spacing="0" pl="base">
        {tabs.map((tab, index) => (
          <Tab stateKey={stateKey} tab={tab} index={index} key={index} />
        ))}
      </Stack>
    );
  }
);
