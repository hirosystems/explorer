import * as React from 'react';
import { Box, color, Flex } from '@stacks/ui';
import { Caption } from '@components/typography';
import { IconAlertTriangle } from '@tabler/icons';

export const SearchErrorMessage: React.FC<{ message: string; hint?: string }> = React.memo(
  ({ message, hint }) => (
    <Box p="base">
      <Flex alignItems="flex-start">
        <Box mr="base" as={IconAlertTriangle} color={color('feedback-error')} />
        <Caption lineHeight="22px">{message}</Caption>
      </Flex>
      {hint ? (
        <Flex
          bg={color('bg-4')}
          mt="base"
          borderRadius="6px"
          p="tight"
          // border={border()}
          alignItems="center"
        >
          <Caption mr="tight" fontWeight="600" color={color('brand')}>
            Hint
          </Caption>
          <Caption lineHeight="22px">{hint}</Caption>
        </Flex>
      ) : null}
    </Box>
  )
);
