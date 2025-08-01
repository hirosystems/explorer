import { Flex, Stack } from '@chakra-ui/react';
import { FC } from 'react';

import { useAppDispatch } from '../../../common/state/hooks';
import { Button } from '../../../ui/Button';
import { Title } from '../../../ui/typography';
import { useUser } from '../hooks/useUser';
import { setUserData } from '../sandbox-slice';

export const ConnectToStacks: FC = () => {
  const { connect } = useUser();

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
      <Stack gap={8} textAlign="center" color="text">
        <Title fontSize={'20px'}>Welcome to the sandbox</Title>
        <Title>Please sign in to continue</Title>
        <Button onClick={connect} width="100%" height={8} variant="secondary">
          Connect Stacks Wallet
        </Button>
      </Stack>
    </Flex>
  );
};
