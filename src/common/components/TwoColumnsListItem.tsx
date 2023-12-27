'use client';

import { FC, ReactNode, memo } from 'react';

import { Box } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { Show } from '../../ui/Show';
import { Text } from '../../ui/Text';
import { leftLineCss } from '../styles/hover';

interface TwoColumnsListProps extends FlexProps {
  icon?: ReactNode;
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
  ({ icon, leftContent, rightContent, ...rest }) => {
    return (
      <Flex
        flexGrow={1}
        gap={4}
        alignItems={'center'}
        py={6}
        css={leftLineCss()}
        minWidth={0}
        borderBottom={'1px'}
        _last={{ borderBottom: 'unset' }}
        {...rest}
      >
        <Show above="lg">{icon && <Box width={10}>{icon}</Box>}</Show>
        <Flex
          width={'full'}
          minWidth={'0px'}
          gap={2}
          direction={['column', 'column', 'column', 'row']}
          alignItems={'flex-start'}
        >
          {leftContent && (
            <Flex
              direction={'column'}
              justifyContent={'center'}
              gap={2}
              minWidth={0}
              flex={'1 1 auto'}
              width={['full', 'full', 'full', 'auto']}
            >
              {leftContent.title !== undefined ? (
                <Text
                  alignItems={'center'}
                  fontSize={'sm'}
                  fontWeight={'semibold'}
                  gap={1.5}
                  minWidth={0}
                  display={'flex'}
                >
                  <Show below="lg">{icon && <Box width={4.5}>{icon}</Box>}</Show>
                  <Box minWidth={0} width={'full'}>
                    {leftContent.title}
                  </Box>
                </Text>
              ) : null}
              {leftContent.subtitle !== undefined ? (
                <Text fontSize={'xs'} color={'secondaryText'}>
                  {leftContent.subtitle}
                </Text>
              ) : null}
            </Flex>
          )}
          {rightContent && (
            <Flex
              direction={'column'}
              justifyContent={'center'}
              gap={2}
              maxWidth={'full'}
              flex={'0 1 auto'}
              width={['full', 'full', 'full', 'auto']}
            >
              {rightContent.title !== undefined ? (
                <Text fontSize={'sm'} textAlign={['left', 'left', 'left', 'right']}>
                  {rightContent.title}
                </Text>
              ) : null}
              {rightContent.subtitle !== undefined ? (
                <Text
                  fontSize={'xs'}
                  color={'secondaryText'}
                  textAlign={['left', 'left', 'left', 'right']}
                >
                  {rightContent.subtitle}
                </Text>
              ) : null}
            </Flex>
          )}
        </Flex>
      </Flex>
    );
  }
);
