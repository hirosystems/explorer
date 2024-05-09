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
  leftContent: {
    title?: ReactNode;
    subtitle?: ReactNode;
  };
  rightContent: {
    title?: ReactNode;
    subtitle?: ReactNode;
  };
}

export const TwoColsListItem: FC<TwoColumnsListProps> = memo(
  ({ icon, leftContent, rightContent, hoverEffect = true, ...rest }) => {
    return (
      <Flex
        flexGrow={1}
        gap={4}
        alignItems="center"
        py={6}
        css={hoverEffect ? leftLineCss() : undefined}
        width={'full'}
        borderBottom={'1px'}
        _last={{ borderBottom: 'unset' }}
        {...rest}
      >
        <Show above="lg">{icon && <Box>{icon}</Box>}</Show>
        <Flex
          width="full"
          gap={2}
          // direction={['column', 'column', 'row', 'row', 'row']}
          direction="column"
          overflow="hidden"
          // alignItems={['flex-start', 'flex-start', 'flex-end', 'flex-end', 'flex-end']}
        >
          <Flex
            width="full"
            direction="row"
            justifyContent="space-between"
            flexWrap="nowrap"
            gap={2}
          >
            {leftContent.title && (
              <Text // TODO: remove this styling
                alignItems="center"
                fontSize="sm"
                fontWeight="semibold"
                gap={1.5}
                display="flex"
                overflow="hidden"
                flex="0 1 auto"
                flexWrap="nowrap"
                minWidth="0"
              >
                <Show below="lg">{icon && <Box>{icon}</Box>}</Show>
                <Box minWidth="0" flex="1 1 0">
                  {leftContent.title}
                </Box>
              </Text>
            )}
            {rightContent.title && (
              <Text
                fontSize="sm"
                display="flex"
                flexWrap="nowrap"
                minWidth="0"
                flex="0 1 auto"
                // justifyContent="flex-end"
              >
                {rightContent.title}
              </Text>
            )}
          </Flex>
          <Flex width="full" direction="row" justifyContent="space-between" minWidth="0" gap={2}>
            {leftContent.subtitle && (
              // <Flex flex="1 1 auto" flexWrap="wrap" minWidth="0">
              <Text
                // display="flex"
                fontSize="xs"
                color="textSubdued"
                flex="1 1 auto"
                flexWrap="wrap"
                alignItems="flex-start"

                // minWidth="0"
              >
                {leftContent.subtitle}
              </Text>
              // </Flex>
            )}
            {rightContent.subtitle && (
              <Text
                display="flex"
                fontSize="xs"
                color="textSubdued"
                minWidth="0"
                flex="0 1 auto"
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                {rightContent.subtitle}
              </Text>
            )}
          </Flex>

          {/* {leftContent && (
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
                  alignItems='center'
                  fontSize='sm'
                  fontWeight='semibold'
                  gap={1.5}
                  minWidth={0}
                  display={'flex'}
                >
                  <Show below="lg">{icon && <Box>{icon}</Box>}</Show>
                  <Box minWidth={0} width={'full'}>
                    {leftContent.title}
                  </Box>
                </Text>
              ) : null}
              {leftContent.subtitle !== undefined ? (
                <Text fontSize='xs' color='textSubdued'>
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
              alignItems={['flex-start', 'flex-start', 'flex-end', 'flex-end']}
            >
              {rightContent.title !== undefined ? (
                <Text fontSize='sm'>{rightContent.title}</Text>
              ) : null}
              {rightContent.subtitle !== undefined ? (
                <Text fontSize='xs' color='textSubdued'>
                  {rightContent.subtitle}
                </Text>
              ) : null}
            </Flex>
          )} */}
        </Flex>
      </Flex>
    );
  }
);
