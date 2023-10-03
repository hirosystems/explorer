import { useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { getQueryParams } from '@/appPages/common/utils/buildUrl';
import { useGlobalContext } from '@/common/context/useAppContext';
import { useAppSelector } from '@/common/state/hooks';
import { Flex, Grid, Spinner } from '@/ui/components';

import { useUser } from './hooks/useUser';
import { ConnectToStacks } from './layout/ConnectToStacks';
import { Header } from './layout/Header';
import { RightPanel } from './layout/RightPanel';
import { SideNav } from './layout/SideNav';
import { selectShowRightPanel } from './sandbox-slice';
import { SkeletonSandbox } from '@/components/loaders/skeleton-transaction';

function Layout({ children }: { children: ReactNode }) {
  const { isConnected, isFetching } = useUser();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const { activeNetwork } = useGlobalContext();
  const showRightPanel = useAppSelector(selectShowRightPanel);

  if (activeNetwork.isSubnet) {
    void router.replace(`/${getQueryParams(activeNetwork)}`);
    return null;
  }

  if (isFetching) return <SkeletonSandbox />;

  return (
    <Flex
      borderWidth="1px"
      borderRadius="12px"
      bg={`bg.${colorMode}`}
      flexDirection="column"
      flexGrow={1}
      flexShrink={1}
      mb="32px"
    >
      <Header />
      <Grid
        gridTemplateColumns={showRightPanel ? `72px 1fr calc(1142px / 3)` : '72px 1fr'}
        minHeight="calc(100vh - 217px)"
        flexGrow={1}
        flexShrink={1}
      >
        <SideNav />
        {isConnected ? children : <ConnectToStacks />}
        <RightPanel />
      </Grid>
    </Flex>
  );
}

export default Layout;
