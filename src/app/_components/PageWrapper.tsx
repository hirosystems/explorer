'use client';

import { useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';

import { AddNetworkModal } from '../../common/components/modals/AddNetwork';
import { NakamotoModal } from '../../common/components/modals/Nakamoto';
import { IncidentContent } from '../../common/types/incidents';
import { TokenPrice } from '../../common/types/tokenPrice';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { NetworkModeToast } from './NetworkModeToast';
import { CMSStatusBars } from './StatusBar/CMSStatusBars';
import { IncidentsStatusBarWithErrorBoundary } from './StatusBar/IncidentsStatusBar';
import { NonHiroNetworkWarningBar } from './StatusBar/NonHiroNetworkWarningBar';

const StyledWrapper = styled(Box)<{ bg: string }>`
  font-variant-ligatures: no-contextual;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  overflow: hidden;
  display: flex; /* Assuming 'direction' is meant to be flex-direction */
  flex-direction: column;
  position: relative;
  background: ${props => props.bg};
  background-repeat: no-repeat, repeat;
  background-size:
    100% 530px,
    100% 100%;
`;

function WrapperWithBg({ children }: { children: ReactNode }) {
  const bgColor = useColorModeValue(
    `linear-gradient(
       29.53deg, 
       #9528F7 2.94%, 
       #522DE7 39.91%, 
       #221A71 76.87%, 
       #0F102B 93.08%
     ), white`,
    `linear-gradient(
       29.53deg, 
       #9528F7 2.94%, 
       #522DE7 39.91%, 
       #221A71 76.87%, 
       #0F102B 93.08%
     ), black`
  );

  return <StyledWrapper bg={bgColor}>{children}</StyledWrapper>;
}

export function PageWrapper({
  tokenPrice,
  children,
  statusBarContent,
}: {
  tokenPrice: TokenPrice;
  children: ReactNode;
  statusBarContent: IncidentContent | null;
}) {
  const statusBarBg = useColorModeValue('black', 'white');
  return (
    <>
      <Flex
        direction={'column'}
        width={'100%'}
        top={'0'}
        backdropFilter={'blur(10px)'}
        background={statusBarBg}
      >
        <NonHiroNetworkWarningBar />
        <IncidentsStatusBarWithErrorBoundary />
        <CMSStatusBars statusBarContent={statusBarContent} />
      </Flex>
      <NakamotoModal />
      <WrapperWithBg>
        <Flex
          mx="auto"
          width="full"
          maxWidth="container.xl"
          flexDirection="column"
          p={6}
          minHeight={'100vh'}
        >
          <NavBar tokenPrice={tokenPrice} />
          <Flex direction={'column'} mt={10} mb={8} gap={7}>
            {children}
          </Flex>
          <Footer />
        </Flex>
      </WrapperWithBg>
      <AddNetworkModal />
      <NetworkModeToast />
    </>
  );
}
