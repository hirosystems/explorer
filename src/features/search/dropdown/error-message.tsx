import { Box, Flex } from '@/ui/components';
import { Caption } from '@/ui/typography';
import * as React from 'react';
import { TbAlertTriangle } from 'react-icons/tb';

export const SearchErrorMessage: React.FC<{ message: string; hint?: string }> = React.memo(
  ({ message, hint }) => (
    <Box p="16px">
      <Flex alignItems="flex-start">
        <Box flexShrink={0} mr="16px" as={TbAlertTriangle} color={'feedbackError'} />
        <Caption lineHeight="22px" wordBreak="break-word">
          {message}
        </Caption>
      </Flex>
      {hint ? (
        <Flex bg={'bg4'} mt="16px" borderRadius="6px" p="8px" alignItems="center">
          <Caption mr="8px" fontWeight="600" color={'brand'}>
            Hint
          </Caption>
          <Caption lineHeight="22px">{hint}</Caption>
        </Flex>
      ) : null}
    </Box>
  )
);
