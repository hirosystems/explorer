import * as React from 'react';
import { Box, Flex, FlexProps, Stack, transition, useClipboard } from '@stacks/ui';
import { Text } from '@components/typography';
import { microToStacks, truncateMiddle } from '@common/utils';
import { useUser } from '@sandbox/hooks/use-user';
import { StxInline } from '@components/icons/stx-inline';
import AccountCircleOutlineIcon from 'mdi-react/AccountCircleOutlineIcon';
import { Tooltip } from '@components/tooltip';
import { IconButton } from '@components/icon-button';
import { CopyIcon } from '@components/icons/copy';
import { useHover } from 'use-events';
import { IconLogout } from '@tabler/icons';
import { useConnect } from '@sandbox/hooks/use-connect';

const Address: React.FC<FlexProps & { isHovered?: boolean }> = ({ isHovered, ...props }) => {
  const { principal } = useUser();
  const { onCopy, hasCopied } = useClipboard(principal as string);
  const { doSignOut } = useConnect();
  return (
    <Flex height="36px" position="relative" alignItems="center" {...props}>
      <Text mr="tight" color="white" display={['none', 'none', 'block']}>
        {truncateMiddle(principal as string, 10)}
      </Text>
      <Text mr="tight" color="white" display={['block', 'block', 'none']}>
        {truncateMiddle(principal as string)}
      </Text>

      <Flex>
        <Box _hover={{ cursor: 'pointer' }} onClick={onCopy} position="relative">
          <Tooltip placement="bottom" label={hasCopied ? 'Copied!' : 'Copy address'}>
            <IconButton icon={CopyIcon} />
          </Tooltip>
        </Box>
        <Box _hover={{ cursor: 'pointer' }} onClick={doSignOut} position="relative">
          <Tooltip placement="bottom" label="Sign out">
            <IconButton icon={IconLogout} />
          </Tooltip>
        </Box>
      </Flex>
    </Flex>
  );
};

export const UserCard = ({ ...rest }: any) => {
  const { balances, username, principal } = useUser();
  const { onCopy, hasCopied } = useClipboard(principal as string);
  const [isHovered, bind] = useHover();

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
          {balances?.stx?.balance ? microToStacks(balances.stx.balance) : 0} STX
        </Text>
      </Flex>
      <Stack
        userSelect="none"
        spacing="tight"
        alignItems="center"
        justifyContent="flex-end"
        isInline
      >
        {username ? (
          <Flex alignItems="center">
            <Flex
              willChange="transform"
              transform={isHovered ? 'translateX(-36px)' : 'none'}
              transition={transition}
              alignItems="center"
              mr="tight"
            >
              <Box mr="tight" opacity={0.5} size="19px">
                <AccountCircleOutlineIcon color="white" size="20px" />
              </Box>
              <Text display="block" color="white">
                {username && username.includes('.') ? username.split('.')[0] : username}
              </Text>
            </Flex>
            <Box
              color="white"
              opacity={0.5}
              willChange="transform"
              transform={isHovered ? 'translateX(-36px)' : 'none'}
              transition={transition}
            >
              |
            </Box>
          </Flex>
        ) : null}
        <Address isHovered={isHovered} {...bind} />
      </Stack>
    </Box>
  ) : null;
};
