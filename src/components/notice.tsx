import React from 'react';
import { Box, Flex, ExclamationMarkCircleIcon, FlexProps } from '@stacks/ui';
import { Text } from '@components/typography';

export const Notice = ({
  label,
  message,
  ...rest
}: { label?: string; message?: string } & FlexProps) => (
  <Box
    mx="auto"
    borderRadius="8px"
    maxWidth="1216px"
    bg="var(--colors-bg-alt)"
    borderBottom="1px solid"
    borderColor="var(--colors-border)"
    {...rest}
  >
    <Flex
      p="tight"
      alignItems={['flex-start', 'flex-start', 'center']}
      justifyContent={['center', 'center', 'flex-start']}
      mx="auto"
      width="100%"
      maxWidth="1280px"
      flexDirection={['column', 'column', 'row']}
      px={['base']}
    >
      <Flex alignItems="center" mb={['tight', 'tight', 'unset']}>
        <Box mr="tight" color="orange">
          <ExclamationMarkCircleIcon size="14px" />
        </Box>
        {label ? (
          <Text
            mr="tight"
            fontWeight="600"
            fontSize="14px"
            lineHeight="22px"
            color="var(--colors-text-title)"
          >
            {label}
          </Text>
        ) : null}
      </Flex>
      {message ? (
        <Text fontSize="14px" lineHeight="22px" color="var(--colors-text-body)">
          {message}
        </Text>
      ) : null}
    </Flex>
  </Box>
);
