'use client';

import { Stack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';

import { AddNetworkModal } from '../../common/components/modals/AddNetwork';
import { NakamotoModal } from '../../common/components/modals/Nakamoto';
import { IncidentContent } from '../../common/types/incidents';
import { TokenPrice } from '../../common/types/tokenPrice';
import { useColorMode, useColorModeValue } from '../../components/ui/color-mode';
import { Box } from '../../ui/Box';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { NetworkModeToast } from './NetworkModeToast';
import { CMSStatusBars } from './StatusBar/CMSStatusBars';
import { IncidentsStatusBarWithErrorBoundary } from './StatusBar/IncidentsStatusBar';
import { NonHiroNetworkWarningBar } from './StatusBar/NonHiroNetworkWarningBar';

const StyledWrapper = styled(Box)<{ bg: string }>`
  display: flex;
  flex-direction: column;
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

const darkBg = `linear-gradient(
       29.53deg, 
       #9528F7 2.94%, 
       #522DE7 39.91%, 
       #221A71 76.87%, 
       #0F102B 93.08%
     ), black`;
const lightBg = `linear-gradient(
       29.53deg, 
       #9528F7 2.94%, 
       #522DE7 39.91%, 
       #221A71 76.87%, 
       #0F102B 93.08%
     ), white`;

function WrapperWithBg({ children, themeCookie }: { children: ReactNode; themeCookie: string }) {
  const { colorMode } = useColorMode();
  const bgColor = colorMode
    ? colorMode === 'light'
      ? lightBg
      : darkBg
    : themeCookie
      ? themeCookie === 'light'
        ? lightBg
        : darkBg
      : lightBg;

  return <StyledWrapper bg={bgColor}>{children}</StyledWrapper>;
}

export function PageWrapper({
  children,
  tokenPrice,
  statusBarContent,
  themeCookie,
}: {
  children: ReactNode;
  tokenPrice: TokenPrice;
  statusBarContent: IncidentContent | null;
  themeCookie: string;
}) {
  const statusBarBg = useColorModeValue('black', 'white');
  return (
    <>
      <Stack width={'100%'} top={'0'} backdropFilter={'blur(10px)'} bg={statusBarBg}>
        <NonHiroNetworkWarningBar />
        <IncidentsStatusBarWithErrorBoundary />
        <CMSStatusBars statusBarContent={statusBarContent} />
      </Stack>
      <NakamotoModal />
      <WrapperWithBg themeCookie={themeCookie}>
        <Stack mx="auto" width="full" maxWidth="breakpoint-xl" p={6} minHeight={'100vh'}>
          <NavBar tokenPrice={tokenPrice} />
          <Stack
            mt={10}
            mb={8}
            gap={7} // TODO: not sure I like putting these spacing styles here. This forces all pages to use fragments. This gap creates the space between the major components on the page.
          >
            {children}
          </Stack>
          <Footer />
        </Stack>
      </WrapperWithBg>

      <AddNetworkModal />
      <NetworkModeToast />
    </>
  );
}
