import React from 'react';
import { Flex, Box, Button, color, Circle, Stack, IconButton, StackProps } from '@stacks/ui';
import { border } from '@common/utils';
import { useConnect } from '@sandbox/hooks/use-connect';
import type { FlexProps } from '@stacks/ui';
import { Caption } from '@components/typography';
import { IconMenu2, IconUser } from '@tabler/icons';
import { useSetRecoilState } from 'recoil';
import { rightPanelState } from '@sandbox/store/views';

const UserCard: React.FC<StackProps> = props => {
  const { userData } = useConnect();
  return (
    <Stack isInline alignItems="center" {...props}>
      <Circle color={color('text-body')} boxShadow="low" size="20px" border={border()}>
        <IconUser size="14px" />
      </Circle>
      <Caption>{userData?.username?.split('.')[0] || userData?.identityAddress}</Caption>
    </Stack>
  );
};

const Actions: React.FC<StackProps> = props => {
  const setRightPanelVisibility = useSetRecoilState(rightPanelState);

  const handleToggle = () => setRightPanelVisibility(v => (v === 'hidden' ? 'showing' : 'hidden'));
  return (
    <Stack isInline alignItems="center" {...props}>
      <IconButton color={color('text-title')} onClick={handleToggle} icon={IconMenu2} />
    </Stack>
  );
};
export const SandboxHeader: React.FC<FlexProps> = props => {
  const { doOpenAuth, isSignedIn } = useConnect();
  return (
    <Flex alignItems="center" justifyContent="space-between" borderBottom={border()} {...props}>
      <Box p="base" color={color('text-title')}>
        Explorer Sandbox
      </Box>
      <Flex alignItems="center" px="base">
        {!isSignedIn ? (
          <Button onClick={doOpenAuth} size="sm">
            Connect Hiro Wallet
          </Button>
        ) : (
          <Stack spacing="loose" isInline>
            <UserCard />
            <Actions />
          </Stack>
        )}
      </Flex>
    </Flex>
  );
};
