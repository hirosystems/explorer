'use client';

import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';

import { useGlobalContext } from '../../common/context/useAppContext';
import { useAppSelector } from '../../common/state/hooks';
import { getQueryParams } from '../../common/utils/buildUrl';
import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { useUser } from './hooks/useUser';
import { ConnectToStacks } from './layout/ConnectToStacks';
import { Header } from './layout/Header';
import { RightPanelSkeleton } from './layout/RightPanelSkeleton';
import { SideNav } from './layout/SideNav';
import { selectShowRightPanel } from './sandbox-slice';

const RightPanel = dynamic(() => import('./layout/RightPanel').then(mod => mod.RightPanel), {
  ssr: false,
  loading: () => <RightPanelSkeleton />,
});

export function Wrapper({ children }: { children: ReactNode }) {
  const { isConnected } = useUser();
  const router = useRouter();
  const colorMode = useColorMode().colorMode;
  const { activeNetwork } = useGlobalContext();
  const showRightPanel = useAppSelector(selectShowRightPanel);

  if (activeNetwork.isSubnet) {
    void router.replace(`/${getQueryParams(activeNetwork)}`);
    return null;
  }

  return (
    <Flex
      borderWidth={'1px'}
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
        {showRightPanel ? <RightPanel /> : null}
      </Grid>
    </Flex>
  );
}
