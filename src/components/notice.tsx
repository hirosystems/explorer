import React from 'react';
import { ExclamationMarkCircleIcon } from '@/ui/ExclamationMarkCircleIcon';
import { Box, Flex, FlexProps } from '@/ui/components';
import { Text } from '@/ui/typography';
import { PAGE_MAX_WIDTH } from '@/common/constants';

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
    borderBottomWidth="1px"
    borderColor="var(--stacks-colors-border)"
    {...rest}
  >
    <Flex
      p="8px"
      alignItems={['flex-start', 'flex-start', 'center']}
      justifyContent={['center', 'center', 'flex-start']}
      mx="auto"
      width="100%"
      maxWidth={PAGE_MAX_WIDTH}
      flexDirection={['column', 'column', 'row']}
      px={['16px']}
    >
      <Flex alignItems="center" mb={['8px', '8px', 'unset']}>
        <Box mr="8px" color="orange">
          <ExclamationMarkCircleIcon size="14px" />
        </Box>
        {label ? (
          <Text
            mr="8px"
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
