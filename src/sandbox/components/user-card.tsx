import * as React from 'react';
import {
  Box,
  color,
  Flex,
  FlexProps,
  Stack,
  StackProps,
  transition,
  useClipboard,
} from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { border, microToStacks, truncateMiddle } from '@common/utils';
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
      <Text mr="tight" color="currentColor" display={['none', 'none', 'block']}>
        {truncateMiddle(principal as string, 10)}
      </Text>
      <Text mr="tight" color="currentColor" display={['block', 'block', 'none']}>
        {truncateMiddle(principal as string)}
      </Text>

      <Flex></Flex>
    </Flex>
  );
};

const Username: React.FC<StackProps> = props => {
  const { username, identityAddress } = useUser();
  return (
    <Stack textAlign="right" justifyContent="flex-end" isInline {...props}>
      <Text display="block" color="currentColor">
        {username?.includes('.')
          ? username.split('.')[0]
          : username || (identityAddress && truncateMiddle(identityAddress, 8))}
      </Text>
    </Stack>
  );
};

const Balance: React.FC<StackProps> = props => {
  const { balances } = useUser();
  return (
    <Stack textAlign="right" {...props}>
      <Caption>Account balance</Caption>
      <Flex
        flexShrink={0}
        flexGrow={1}
        alignItems="center"
        position="relative"
        justifyContent="flex-end"
        color={color('text-title')}
      >
        <StxInline strokeWidth={2} color="currentColor" mr="tight" size="18px" />
        <Text fontWeight={600} fontSize={4} display="block" position="relative" zIndex={2}>
          {balances?.stx?.balance ? microToStacks(balances.stx.balance) : 0} STX
        </Text>
      </Flex>
    </Stack>
  );
};
export const UserCard = ({ ...rest }: any) => {
  const { balances, username, principal } = useUser();
  const { doSignOut } = useConnect();
  const { onCopy, hasCopied } = useClipboard(principal as string);
  const [isHovered, bind] = useHover();

  return balances ? (
    <Box bg={color('bg')} borderBottom={border()} p="loose" {...rest}>
      <Stack spacing="base">
        <Balance />
        {principal && (
          <Flex textAlign="right" justifyContent="flex-end" alignItems="center">
            <Tooltip
              labelProps={{ fontSize: 0 }}
              placement="left"
              label={hasCopied ? 'Copied!' : 'Click to copy'}
            >
              <Caption onClick={onCopy} _hover={{ cursor: 'pointer' }}>
                {truncateMiddle(principal, 12)}
              </Caption>
            </Tooltip>
            <Box _hover={{ cursor: 'pointer' }} onClick={doSignOut} position="relative" ml="tight">
              <Tooltip placement="bottom" label="Sign out">
                <IconButton
                  size="20px"
                  iconSize="14px"
                  color={color('text-body')}
                  icon={IconLogout}
                />
              </Tooltip>
            </Box>
          </Flex>
        )}
      </Stack>
    </Box>
  ) : null;
};
