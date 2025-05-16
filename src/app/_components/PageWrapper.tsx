'use client';

import { Stack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';

import { AddNetworkModal } from '../../common/components/modals/AddNetwork';
import { AddNetworkModalNew } from '../../common/components/modals/AddNetworkNew';
import { IncidentContent } from '../../common/types/incidents';
import { TokenPrice } from '../../common/types/tokenPrice';
import { HybridExplorerBanner } from './Banner/HybridExplorerBanner';
import { TestnetBanner } from './Banner/TestnetBanner';
import { NetworkModeToast } from './NetworkModeToast';
import { NewFooter } from './NewFooter';
import { NavBar as NewNavBar } from './NewNavBar/NavBar';
import { CMSStatusBars } from './StatusBar/CMSStatusBars';
import { IncidentsStatusBar } from './StatusBar/IncidentsStatusBar';
import { NonHiroNetworkWarningBar } from './StatusBar/NonHiroNetworkWarningBar';

const StyledWrapper = styled(Stack)<{ bg: string }>`
  position: relative;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  overflow: hidden;
  background: ${props => props.bg};
  background-repeat: no-repeat, repeat;
  background-size:
    100% 530px,
    100% 100%;
  font-variant-ligatures: no-contextual;
`;

function WrapperWithBg({ children }: { children: ReactNode; serverThemeCookie: string }) {
  return (
    <StyledWrapper bg={'surfaceTertiary'} className="wrapper-with-bg">
      {children}
    </StyledWrapper>
  );
}

export function PageWrapper({
  children,
  tokenPrice,
  statusBarContent,
  serverThemeCookie,
}: {
  children: ReactNode;
  tokenPrice: TokenPrice;
  statusBarContent: IncidentContent | null;
  serverThemeCookie: string;
}) {
  return (
    <>
      <Stack gap={0} top={0} w="full">
        <NonHiroNetworkWarningBar />
        <IncidentsStatusBar />
        <CMSStatusBars statusBarContent={statusBarContent} />
        <HybridExplorerBanner />
        <TestnetBanner />
      </Stack>
      <WrapperWithBg serverThemeCookie={serverThemeCookie}>
        <Stack mx="auto" width="full" maxWidth="breakpoint-2xl" p={6} minHeight={'100vh'}>
          <NewNavBar tokenPrices={tokenPrice} />
          <Stack
            marginTop={'50px'}
            mb={8}
            gap={7} // TODO: not sure I like putting these spacing styles here. This forces all pages to use fragments. This gap creates the space between the major components on the page.
          >
            {children}
          </Stack>
          <NewFooter />
        </Stack>
      </WrapperWithBg>
      <AddNetworkModal />
      <AddNetworkModalNew />
      <NetworkModeToast />
    </>
  );
}
