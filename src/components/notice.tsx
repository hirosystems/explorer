import React from 'react';
import { Box, Flex, ExclamationMarkCircleIcon, FlexProps } from '@blockstack/ui';
import { Text } from '@components/typography';

export const Notice = ({ children, ...rest }: FlexProps) => (
  <Flex
    p="tight"
    align="center"
    justify="center"
    bg="rgba(249, 161, 77, 0.5)"
    borderBottom="1px solid"
    borderTop="1px solid"
    borderColor="rgba(249, 161, 77, 0.5)"
    {...rest}
  >
    <Box mr="tight" color="var(--colors-text-title)">
      <ExclamationMarkCircleIcon size="16px" />
    </Box>
    <Text fontWeight="500" fontSize="14px" color="var(--colors-text-title)">
      {children}
    </Text>
  </Flex>
);
