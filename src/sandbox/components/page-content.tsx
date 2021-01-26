import React, { memo } from 'react';
import { Box, color, Grid, Flex } from '@stacks/ui';
import { border } from '@common/utils';
import { SideNav } from '@sandbox/components/side-nav';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sandboxRouteState } from '@sandbox/store/sandbox';
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

const View: React.FC = memo(() => {
  const route = useRecoilValue(sandboxRouteState);

  switch (route) {
    case 'deploy':
      return (
        <Grid minHeight="600px" gridTemplateColumns={`365px 1fr`} flexGrow={1} flexShrink={1}>
          <WriteAndDeployTools />
          <WriteAndDeployView />
        </Grid>
      );
    case 'function-call':
      return (
        <React.Suspense fallback={<></>}>
          <FunctionCallView />
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

export const SandboxPageContent: React.FC = () => {
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
        <SideNav />
        <View />
        {panelVisible && isSignedIn ? <Menu /> : null}
      </Grid>
    </Flex>
  );
};
