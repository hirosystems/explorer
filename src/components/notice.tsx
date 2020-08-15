import React from 'react';
import { Box, Flex, ExclamationMarkCircleIcon, FlexProps } from '@stacks/ui';
import { Text } from '@components/typography';

export const Notice = ({
  label,
  message,
  ...rest
}: { label?: string; message?: string } & FlexProps) => (
  <Box
    bg="var(--colors-bg-alt)"
    borderBottom="1px solid"
    borderColor="var(--colors-border)"
    {...rest}
  >
    <Flex
      p="tight"
      alignItems="center"
      justify="flex-start"
      mx="auto"
      width="100%"
      maxWidth="1280px"
      px={['base', 'base', 'extra-loose']}
    >
      <Box mr="tight" color="orange">
        <ExclamationMarkCircleIcon size="14px" />
      </Box>
      {label ? (
        <Text mr="tight" fontWeight="600" fontSize="14px" color="var(--colors-text-title)">
          {label}
        </Text>
      ) : null}
      {message ? (
        <Text fontSize="14px" color="var(--colors-text-caption)">
          {message}
        </Text>
      ) : null}
    </Flex>
  </Box>
);
