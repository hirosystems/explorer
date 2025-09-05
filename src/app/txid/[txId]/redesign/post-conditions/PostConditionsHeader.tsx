import { StatusBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

import { PostConditionMode } from '@stacks/stacks-blockchain-api-types';

export function PostConditionsHeader({
  postConditionMode,
}: {
  postConditionMode: PostConditionMode;
}) {
  return (
    <Flex
      gap={2.5}
      flexDirection={{ base: 'column', md: 'row' }}
      alignItems={{ base: 'flex-start', md: 'center' }}
    >
      <StatusBadge
        successLabel="Allow mode"
        failureLabel="Deny mode"
        success={postConditionMode === 'allow'}
      />
      <Text textStyle="text-regular-sm" color="textSecondary">
        {postConditionMode === 'allow'
          ? 'The transaction must at least meet the listed post-conditions, but other transfers are allowed too.'
          : 'Only the post-conditions explicitly listed are allowed. Anything not listed will cause the transaction to fail.'}
      </Text>
    </Flex>
  );
}
