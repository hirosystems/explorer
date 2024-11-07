'use client';

import { Box, Flex, FlexProps, Stack } from '@chakra-ui/react';
import { FC, ReactNode, memo } from 'react';

import { Text } from '../../ui/Text';

const leftLineCss = {
  '&': {
    position: 'relative',
  },

  '&:after': {
    display: 'block',
    content: "''",
    position: 'absolute',
    background: 'var(--stacks-colors-brand)',
    left: 'calc(var(--stacks-spacing-6) * -1)',
    width: '3px',
    top: '50%',
    height: '0',
    transition:
      'height 0.5s cubic-bezier(0.23, 1, 0.32, 1), top 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    '&:hover': {
      height: '100%',
      top: '0',
    },
  },
  '&:hover:after': {
    height: '100%',
    top: '0',
  },
};

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

const TwoColsListItemLargeScreen = ({
  icon,
  leftContent,
  rightContent,
  hoverEffect = true,
  ...rest
}: TwoColumnsListProps) => {
  return (
    <Flex
      flexGrow={1}
      gap={4}
      alignItems="center"
      py={6}
      css={hoverEffect ? { ...leftLineCss } : {}}
      width="full"
      {...rest}
    >
      <Flex hideBelow="lg" width="fit-content">
        {icon && <Box>{icon}</Box>}
      </Flex>
      <Stack gap={2} overflow="hidden" w="full">
        <Flex width="full" minWidth="0" justifyContent="space-between" flexWrap="wrap" gap={2}>
          {leftContent?.title && (
            <Text alignItems="center" gap={1.5} fontSize="sm" fontWeight="semibold" display="flex">
              <Flex hideFrom="lg">{icon && <Box>{icon}</Box>}</Flex>
              {leftContent.title}
            </Text>
          )}
          {rightContent?.title && <Text fontSize="sm">{rightContent.title}</Text>}
        </Flex>
        <Flex width="full" minWidth="0" justifyContent="space-between" flexWrap="wrap" gap={2}>
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
      </Stack>
    </Flex>
  );
};

const TwoColsListItemSmallScreen = ({
  icon,
  leftContent,
  rightContent,
  hoverEffect = true,
  ...rest
}: TwoColumnsListProps) => {
  return (
    <Flex
      flexGrow={1}
      gap={4}
      alignItems="center"
      py={6}
      css={hoverEffect ? { ...leftLineCss } : {}}
      width="full"
      {...rest}
    >
      <Stack width="full" gap={2}>
        {leftContent?.title && (
          <Text alignItems="center" gap={1.5} fontSize="sm" fontWeight="semibold" display="flex">
            <Flex hideFrom="lg">{icon && <Box>{icon}</Box>}</Flex>
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
      </Stack>
    </Flex>
  );
};

export const TwoColsListItem: FC<TwoColumnsListProps> = memo(props => {
  return (
    <Box
      borderBottom="1px solid var(--stacks-colors-border-secondary)"
      _last={{ borderBottom: 'unset' }}
      width="full"
    >
      <Box hideBelow="lg">
        <TwoColsListItemLargeScreen {...props} />
      </Box>
      <Box hideFrom="lg">
        <TwoColsListItemSmallScreen {...props} />
      </Box>
    </Box>
  );
});
