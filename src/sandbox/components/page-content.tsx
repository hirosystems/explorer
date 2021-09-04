import React, { memo } from 'react';
import { Box, color, Grid, Flex, Button, Stack } from '@stacks/ui';
import { border } from '@common/utils';
import { SideNav } from '@sandbox/components/side-nav';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { WriteAndDeployView } from '@sandbox/components/screens/write-deploy/view';
import { WriteAndDeployTools } from '@sandbox/components/screens/write-deploy/tools-panel';
import { SandboxHeader } from '@sandbox/components/header';
import { FunctionCallView } from '@sandbox/components/screens/call-functions/view';
import { UserCard } from '@sandbox/components/user-card';
import { FaucetView } from '@sandbox/components/views/faucet';
import { TransactionsPanel } from '@sandbox/components/transactions-panel';
import { rightPanelState } from '@sandbox/store/views';
import { useConnect } from '@sandbox/hooks/use-connect';
import { TokenTransferView } from '@sandbox/components/views/token-transfer';
import { useAuthState } from '@sandbox/hooks/use-auth';
import { Title } from '@components/typography';

const View: React.FC<{ view: string; sender: string; contract: string }> = memo(props => {
  const { view } = props;

  const { isSignedIn, doOpenAuth } = useConnect();

  if (!isSignedIn)
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
        <Stack spacing="extra-loose" textAlign="center">
          <Title fontSize={3}>Welcome to the sandbox</Title>
          <Title>Please sign in to continue</Title>
          <Button onClick={doOpenAuth} width="100%">
            Connect Hiro Wallet
          </Button>
        </Stack>
      </Flex>
    );

  switch (view) {
    case 'contract-call':
      return (
        <React.Suspense fallback={<Box flexGrow={1} />}>
          <FunctionCallView {...props} />
        </React.Suspense>
      );
    case 'transfer':
      return (
        <Grid minHeight="600px" gridTemplateColumns={`600px`} flexGrow={1} flexShrink={1}>
          <TokenTransferView />
        </Grid>
      );
    case 'faucet':
      return (
        <React.Suspense fallback={<></>}>
          <FaucetView />
        </React.Suspense>
      );
    case 'deploy':
      return (
        <Grid minHeight="600px" gridTemplateColumns={`365px 1fr`} flexGrow={1} flexShrink={1}>
          <WriteAndDeployTools />
          <WriteAndDeployView />
        </Grid>
      );
  }
  return null;
});

const Menu = () => {
  return (
    <Flex flexGrow={1} flexDirection="column" borderLeft={border()}>
      <UserCard />
      <TransactionsPanel />
    </Flex>
  );
};

export const SandboxPageContent: React.FC<{
  view: string;
  sender: string;
  contract: string;
}> = props => {
  const rightPanelVisibility = useRecoilValue(rightPanelState);
  const panelVisible = rightPanelVisibility === 'showing';
  const { isSignedIn } = useConnect();

  if (typeof document === 'undefined') {
    return null;
  }
  return (
    <Flex
      border={border()}
      borderRadius="12px"
      bg={color('bg')}
      flexDirection="column"
      flexGrow={1}
      flexShrink={1}
      mb="extra-loose"
    >
      <SandboxHeader />
      <Grid
        gridTemplateColumns={panelVisible ? `72px 1fr 460px` : '72px 1fr'}
        minHeight="calc(100vh - 217px)"
        flexGrow={1}
        flexShrink={1}
      >
        <SideNav {...props} />
        <View {...props} />
        {panelVisible && isSignedIn ? <Menu /> : null}
      </Grid>
    </Flex>
  );
};
