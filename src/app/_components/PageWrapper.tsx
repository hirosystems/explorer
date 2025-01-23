'use client';

import { isRedesignUrl } from '@/common/utils/url-utils';
import { Stack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { useCookies } from 'react-cookie';

import { AddNetworkModal } from '../../common/components/modals/AddNetwork';
import { AddNetworkModalNew } from '../../common/components/modals/AddNetworkNew';
import { IncidentContent } from '../../common/types/incidents';
import { TokenPrice } from '../../common/types/tokenPrice';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { NetworkModeToast } from './NetworkModeToast';
import { NewFooter } from './NewFooter';
import { NavBar as NewNavBar } from './NewNavBar/NavBar';
import { CMSStatusBars } from './StatusBar/CMSStatusBars';
import { IncidentsStatusBarWithErrorBoundary } from './StatusBar/IncidentsStatusBar';
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

function WrapperWithBg({
  children,
  serverThemeCookie,
}: {
  children: ReactNode;
  serverThemeCookie: string;
}) {
  const [clientThemeCookie] = useCookies(['stacks-explorer-theme']);
  const isServer = typeof window === 'undefined';
  const bgColor = isServer
    ? serverThemeCookie
      ? serverThemeCookie === 'light'
        ? lightBg
        : darkBg
      : lightBg
    : clientThemeCookie['stacks-explorer-theme']
      ? clientThemeCookie['stacks-explorer-theme'] === 'light'
        ? lightBg
        : darkBg
      : lightBg;
  return (
    <StyledWrapper bg={bgColor} className="wrapper-with-bg">
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
  const isRedesign = isRedesignUrl();

  return (
    <>
      <Stack width={'100%'} top={0} backdropFilter={'blur(10px)'} bg={'surfaceOpposite'}>
        <NonHiroNetworkWarningBar />
        <IncidentsStatusBarWithErrorBoundary />
        <CMSStatusBars statusBarContent={statusBarContent} />
      </Stack>
      <WrapperWithBg serverThemeCookie={serverThemeCookie}>
        <Stack mx="auto" width="full" maxWidth="breakpoint-xl" p={6} minHeight={'100vh'}>
          {isRedesign ? <NewNavBar /> : <NavBar tokenPrice={tokenPrice} />}
          <Stack
            marginTop={'120px'} // TODO: setting this to 30 doesn't work. fix this
            mb={8}
            gap={7} // TODO: not sure I like putting these spacing styles here. This forces all pages to use fragments. This gap creates the space between the major components on the page.
          >
            {children}
          </Stack>
          {isRedesign ? <NewFooter /> : <Footer />}
        </Stack>
      </WrapperWithBg>
      <AddNetworkModal />
      <AddNetworkModalNew />
      <NetworkModeToast />
    </>
  );
}
