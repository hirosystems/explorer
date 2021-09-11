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
            Connect Stacks Wallet
          </Button>
        </Stack>
      </Flex>
    );

  switch (view) {
    case 'deploy':
      return (
        <Grid minHeight="600px" gridTemplateColumns="365px 1fr" flexGrow={1} flexShrink={1}>
          <WriteAndDeployTools />
          <WriteAndDeployView />
        </Grid>
      );
    case 'contract-call':
      return (
        <React.Suspense fallback={<Box flexGrow={1} />}>
          <Grid
            minHeight="600px"
            width="calc((1142px / 3) * 2)"
            gridTemplateColumns="repeat(2, 1fr)"
            flexGrow={1}
            flexShrink={1}
          >
            <FunctionCallView {...props} />
          </Grid>
        </React.Suspense>
      );
    case 'transfer':
      return (
        <Grid minHeight="600px" gridTemplateColumns="760px" flexGrow={1} flexShrink={1}>
          <TokenTransferView />
        </Grid>
      );
    case 'faucet':
      return (
        <React.Suspense fallback={<></>}>
          <Grid minHeight="600px" placeItems="center" flexDirection="column">
            <FaucetView />
          </Grid>
        </React.Suspense>
      );
  }
  return null;
});

const Menu = () => {
  return (
    <Flex
      flexGrow={1}
      flexDirection="column"
      maxHeight={'calc(100vh - 217px)'}
      zIndex="100"
      borderLeft={border()}
    >
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
        gridTemplateColumns={panelVisible ? `72px 1fr calc(1142px / 3)` : '72px 1fr'}
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
