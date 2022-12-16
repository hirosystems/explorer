import { FC, memo } from 'react';
import * as React from 'react';

import { Box, Flex } from '@stacks/ui';

import { Section } from '@components/section';

export interface TabsTitleProps {
  currentIndex: number;
  setCurrentIndex: (val: number) => void;
}

export const TabsWrapper: FC<{
  currentIndex: number;
  setCurrentIndex: (val: number) => void;
  TopRight?: FC;
  Title: FC<TabsTitleProps>;
  bgColor?: string;
  px?: string;
}> = ({ setCurrentIndex, currentIndex, TopRight, Title, bgColor, px, children }) => (
  <Section
    title={memo(() => (
      <Title currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
    ))}
    headerProps={{ pl: '0' }}
    alignSelf="flex-start"
    topRight={TopRight}
    gridColumnStart="1"
    gridColumnEnd="2"
    width={'100%'}
  >
    <Flex flexGrow={1} flexDirection="column" px={px || 'base-loose'} backgroundColor={bgColor}>
      <Box position="relative">{children}</Box>
    </Flex>
  </Section>
);
