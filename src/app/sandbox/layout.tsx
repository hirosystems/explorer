'use client';

import { useAppSelector } from '@/common/state/hooks';
import { Flex, Grid } from '@/ui/components';
import { useColorMode } from '@chakra-ui/react';
import React, { FC, PropsWithChildren } from 'react';

import { useUser } from './hooks/useUser';
import { ConnectToStacks } from './layout/ConnectToStacks';
import { Header } from './layout/Header';
import { RightPanel } from './layout/RightPanel';
import { SideNav } from './layout/SideNav';
import { selectShowRightPanel } from './sandbox-slice';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { isConnected } = useUser();

  const showRightPanel = useAppSelector(selectShowRightPanel);

  return (
    <>
      <Flex
        borderWidth={'1px'}
        borderRadius="12px"
        bg={`bg.${useColorMode().colorMode}`}
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
    </>
  );
};

export default Layout;
