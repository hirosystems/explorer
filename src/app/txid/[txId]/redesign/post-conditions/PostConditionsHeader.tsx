import { DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

import { PostConditionMode } from '@stacks/stacks-blockchain-api-types';

export function PostConditionsHeader({
  postConditionMode,
}: {
  postConditionMode: PostConditionMode;
}) {
  return (
    <Flex gap={2.5} alignItems="center" flexDirection={{ base: 'column', md: 'row' }}>
      <DefaultBadge
        icon={
          <DefaultBadgeIcon
            icon={postConditionMode === 'allow' ? <CheckCircle /> : <XCircle />}
            color={postConditionMode === 'allow' ? 'feedback.green-500' : 'iconError'}
            bg={
              postConditionMode === 'allow'
                ? 'transactionStatus.confirmed'
                : 'transactionStatuses.failed'
            }
          />
        }
        label={
          postConditionMode === 'allow' ? (
            <DefaultBadgeLabel label="Allow mode" />
          ) : (
            <DefaultBadgeLabel label="Deny mode" />
          )
        }
        textStyle="text-medium-sm"
        bg={
          postConditionMode === 'allow' ? 'transactionStatus.confirmed' : 'transactionStatus.failed'
        }
        border="none"
      />
      <Text textStyle="text-regular-sm" color="textSecondary">
        {postConditionMode === 'allow'
          ? 'The transaction must at least meet the listed post-conditions, but other transfers are allowed too.'
          : 'Only the post-conditions explicitly listed are allowed. Anything not listed will cause the transaction to fail.'}
      </Text>
    </Flex>
  );
}
