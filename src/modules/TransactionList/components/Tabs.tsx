import * as React from 'react';
import { memo } from 'react';

import { Box, BoxProps, Stack, color } from '@stacks/ui';

import { capitalize } from '@common/utils';

import { Caption } from '@components/typography';

interface TabProps extends BoxProps {
  tab: string;
  index: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const Tab: React.FC<TabProps> = memo(({ tab, index, currentIndex, setCurrentIndex }) => {
  const isActive = index === currentIndex;
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
      _hover={{
        cursor: 'pointer',
        color: color('brand'),
      }}
      position="relative"
      bg={isActive ? color('bg-4') : 'transparent'}
      py="base-tight"
      borderRadius="10px"
    >
      <Caption opacity={isActive ? 1 : 0.85} fontSize={1} fontWeight={500} color="currentColor">
        {capitalize(tab)}
      </Caption>
    </Box>
  );
});

export const Tabs = memo(
  ({
    tabs,
    currentIndex,
    setCurrentIndex,
  }: {
    tabs: string[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
  }) => {
    return (
      <Stack isInline spacing="0" pl="base">
        {tabs.map((tab, index) => (
          <Tab
            tab={tab}
            index={index}
            key={index}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        ))}
      </Stack>
    );
  }
);
