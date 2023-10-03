import React, { ReactNode } from 'react';
import { TbMenu2, TbUser } from 'react-icons/tb';
import { useAppDispatch } from '@/common/state/hooks';
import { Box } from '@/ui/Box';
import { Button } from '@/ui/Button';
import { Circle } from '@/ui/Circle';
import { Flex } from '@/ui/Flex';
import { IconButton } from '@/ui/IconButton';
import { Stack } from '@/ui/Stack';
import { Caption } from '@/ui/typography';

import { useUser } from '../hooks/useUser';
import { setUserData, toggleRightPanel } from '../sandbox-slice';

export function Header(props: { children?: ReactNode }) {
  const dispatch = useAppDispatch();
  const { isConnected, userData, connect } = useUser();
  return (
    <Flex alignItems="center" justifyContent="space-between" borderBottomWidth="1px">
      <Box p="16px" color="textTitle">
        Stacks Explorer Sandbox
      </Box>
      <Flex alignItems="center" px="16px">
        {!isConnected ? (
          <Button
            onClick={() =>
              connect({
                onFinish: authData => {
                  dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                },
              })
            }
            size="sm"
          >
            Connect Stacks Wallet
          </Button>
        ) : (
          <Stack spacing="24px" isInline>
            <Stack isInline alignItems="center">
              <Circle color="textBody" size="20px">
                <TbUser size="14px" />
              </Circle>
              <Caption>{userData?.identityAddress}</Caption>
            </Stack>
            <Stack isInline alignItems="center">
              <IconButton
                color="textTitle"
                onClick={() => dispatch(toggleRightPanel())}
                icon={<TbMenu2 />}
                aria-label="Toggle right panel"
              />
            </Stack>
          </Stack>
        )}
      </Flex>
    </Flex>
  );
}
