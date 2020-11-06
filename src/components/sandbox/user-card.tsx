import * as React from 'react';
import { Box, Flex, Stack, useClipboard } from '@stacks/ui';
import { Text } from '@components/typography';
import { microToStacks, truncateMiddle } from '@common/utils';
import { useUser } from '@common/hooks/use-user';
import { StxInline } from '@components/icons/stx-inline';
import AccountCircleOutlineIcon from 'mdi-react/AccountCircleOutlineIcon';
import { Tooltip } from '@components/tooltip';

export const UserCard = ({ ...rest }: any) => {
  const { balances, username, principal } = useUser();
  const { onCopy, hasCopied } = useClipboard(principal as string);

  return balances ? (
    <Box textAlign="right" {...rest}>
      <Flex
        flexShrink={0}
        flexGrow={1}
        justifyContent="flex-end"
        textAlign="right"
        alignItems="center"
        position="relative"
        color="white"
        mb="tight"
      >
        <StxInline strokeWidth={2} color="currentColor" mr="tight" size="18px" />
        <Text fontWeight={600} fontSize="22px" display="block" position="relative" zIndex={2}>
          {balances ? microToStacks(balances.stx.balance) : 0} STX
        </Text>
      </Flex>
      <Stack spacing="tight" isInline>
        <Flex>
          <Box mr="extra-tight" opacity={0.5}>
            <AccountCircleOutlineIcon color="white" size="20px" />
          </Box>
          <Text display="block" color="white">
            {username && username}
          </Text>
        </Flex>
        <Box color="white" opacity={0.5}>
          |
        </Box>
        <Box _hover={{ cursor: 'pointer' }} onClick={onCopy} position="relative">
          <Tooltip label={hasCopied ? 'Copied!' : 'Click to copy your address'}>
            <Text display="block" color="white">
              {truncateMiddle(principal as string)}
            </Text>
          </Tooltip>
        </Box>
      </Stack>
    </Box>
  ) : null;
};
