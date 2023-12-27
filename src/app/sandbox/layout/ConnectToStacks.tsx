import { useColorModeValue } from '@chakra-ui/react';
import React, { FC } from 'react';

import { useAppDispatch } from '../../../common/state/hooks';
import { Button } from '../../../ui/Button';
import { Flex } from '../../../ui/Flex';
import { Stack } from '../../../ui/Stack';
import { Title } from '../../../ui/typography';
import { useUser } from '../hooks/useUser';
import { setUserData } from '../sandbox-slice';

export const ConnectToStacks: FC = () => {
  const dispatch = useAppDispatch();
  const { connect } = useUser();
  const textColor = useColorModeValue('black', 'white');

  return (
    <Flex
      flexGrow={1}
      alignItems="center"
      justifyContent="flex-start"
      pt="120px"
      flexDirection="column"
      maxWidth="300px"
      mx="auto"
    >
      <Stack gap={8} textAlign="center" color={textColor}>
        <Title fontSize={'20px'}>Welcome to the sandbox</Title>
        <Title>Please sign in to continue</Title>
        <Button
          onClick={() =>
            connect({
              onFinish: authData => {
                dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
              },
            })
          }
          width="100%"
          variant="secondary"
        >
          Connect Stacks Wallet
        </Button>
      </Stack>
    </Flex>
  );
};
