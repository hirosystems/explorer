'use client';

import { FC, ReactNode, memo } from 'react';

import { Box } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { Show } from '../../ui/Show';
import { Text } from '../../ui/Text';
import { leftLineCss } from '../styles/hover';

interface TwoColumnsListProps extends FlexProps {
  icon?: ReactNode;
  hoverEffect?: boolean;
  leftContent?: {
    title?: ReactNode;
    subtitle?: ReactNode;
  };
  rightContent?: {
    title?: ReactNode;
    subtitle?: ReactNode;
  };
}

export const TwoColsListItem: FC<TwoColumnsListProps> = memo(
  ({ icon, leftContent, rightContent, hoverEffect = true, ...rest }) => {
    return (
      <Box borderBottom="1px" _last={{ borderBottom: 'unset' }}>
        <Flex
          flexGrow={1}
          gap={4}
          alignItems="center"
          py={6}
          css={hoverEffect ? leftLineCss() : undefined}
          width="full"
          display={['none', 'none', 'flex', 'flex', 'flex']}
          {...rest}
        >
          <Show above="lg">{icon && <Box>{icon}</Box>}</Show>
          <Flex width="full" gap={2} direction="column" overflow="hidden">
            <Flex
              width="full"
              minWidth="0"
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              {leftContent?.title && (
                <Text
                  alignItems="center"
                  gap={1.5}
                  fontSize="sm"
                  fontWeight="semibold"
                  display="flex"
                >
                  <Show below="lg">{icon && <Box>{icon}</Box>}</Show>
                  {leftContent.title}
                </Text>
              )}
              {rightContent?.title && <Text fontSize="sm">{rightContent.title}</Text>}
            </Flex>
            <Flex
              width="full"
              minWidth="0"
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              {leftContent?.subtitle && (
                <Text fontSize="xs" color="textSubdued">
                  {leftContent.subtitle}
                </Text>
              )}
              {rightContent?.subtitle && (
                <Text fontSize="xs" color="textSubdued">
                  {rightContent.subtitle}
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexGrow={1}
          gap={4}
          alignItems="center"
          py={6}
          css={hoverEffect ? leftLineCss() : undefined}
          width="full"
          borderBottom="1px"
          _last={{ borderBottom: 'unset' }}
          display={['flex', 'flex', 'none', 'none', 'none']}
          {...rest}
        >
          <Flex width="full" gap={2} direction="column">
            {leftContent?.title && (
              <Text
                alignItems="center"
                gap={1.5}
                fontSize="sm"
                fontWeight="semibold"
                display="flex"
              >
                <Show below="lg">{icon && <Box>{icon}</Box>}</Show>
                {leftContent.title}
              </Text>
            )}
            {leftContent?.subtitle && (
              <Text fontSize="xs" color="textSubdued">
                {leftContent.subtitle}
              </Text>
            )}
            {rightContent?.title && <Text fontSize="sm">{rightContent.title}</Text>}
            {rightContent?.subtitle && (
              <Text fontSize="xs" color="textSubdued">
                {rightContent.subtitle}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>
    );
  }
);
