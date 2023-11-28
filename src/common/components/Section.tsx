'use client';

import React, { ReactNode } from 'react';

import { Flex, FlexProps } from '../../ui/Flex';
import { Spinner } from '../../ui/Spinner';
import { Text } from '../../ui/Text';
import { SECTION_HEADER_HEIGHT } from '../constants/sizes';
import { isReactComponent } from '../utils/utils';
import { Card } from './Card';

interface SectionProps extends Omit<FlexProps, 'title'> {
  title?: string;
}

const SectionHeader: React.FC<SectionProps> = React.memo(({ title, children, ...rest }) => {
  return (
    <Flex
      alignItems="center"
      bg={'bg'}
      justifyContent="space-between"
      borderBottomWidth="1px"
      flexShrink={0}
      p="12px 16px"
      borderTopRightRadius="12px"
      borderTopLeftRadius="12px"
      minHeight={SECTION_HEADER_HEIGHT}
      {...rest}
    >
      {title ? (
        <Text color={'textTitle'} fontWeight="500" py={'10px'}>
          {title}
        </Text>
      ) : null}
      {children}
    </Flex>
  );
});

export const Section: React.FC<
  { topRight?: ReactNode; isLoading?: boolean; headerProps?: SectionProps } & SectionProps
> = React.memo(
  ({
    title,
    topRight: TopRight = null,
    children,
    overflowY,
    headerProps = {},
    isLoading,
    ...rest
  }) => {
    return (
      <Card {...rest}>
        {title || TopRight ? (
          <SectionHeader title={title} {...headerProps}>
            <Flex justifyContent="flex-end" alignItems="center">
              {isLoading ? <Spinner size="sm" color={'textCaption'} opacity={0.5} /> : null}
              {TopRight}
            </Flex>
          </SectionHeader>
        ) : null}
        <Flex overflowY={overflowY} flexDirection="column" flexGrow={1}>
          {children}
        </Flex>
      </Card>
    );
  }
);

interface SectionWithControlsProps extends Omit<FlexProps, 'title'> {
  title: string;
  controls?: ReactNode;
  footer?: ReactNode;
}

export function SectionWithControls({ title, controls, footer }: SectionWithControlsProps) {
  return (
    <Card padding="16px 24px">
      <Text mb={'16.5px'} fontWeight={500} lineHeight={'1.5em'}>
        {title}
      </Text>
      {controls}
      <Flex flex={1}></Flex>
      <Flex mt={'16px'} width={'100%'}>
        {footer}
      </Flex>
    </Card>
  );
}
