'use client';

import { useColorModeValue } from '@chakra-ui/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { ReactNode } from 'react';

import { AddNetworkModal } from '../../common/components/modals/AddNetwork';
import { NakamotoModal } from '../../common/components/modals/Nakamoto';
import { useGlobalContext } from '../../common/context/useGlobalContext';
import { IncidentContent } from '../../common/types/incidents';
import { TokenPrice } from '../../common/types/tokenPrice';
import { getRichTextRenderOptions } from '../../common/utils/getRichTextRenderOptions';
import { Flex } from '../../ui/Flex';
import { useColorMode } from '../../ui/hooks/useColorMode';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { NetworkModeToast } from './NetworkModeToast';
import { IncidentsStatusBarWithErrorBoundary } from './StatusBar';
import { CMSStatusBars } from './StatusBar/CMSStatusBars';
import { StatusBarBase } from './StatusBar/StatusBarBase';

function WrapperWithBg({ children }: { children: ReactNode }) {
  return (
    <Flex
      maxWidth="100vw"
      minHeight="100vh"
      overflowX="hidden"
      direction="column"
      position="relative"
      overflow="hidden"
      bg={useColorModeValue(
        `linear-gradient(
                 29.53deg, 
                 #9528F7 2.94%, 
                 #522DE7 39.91%, 
                 #221A71 76.87%, 
                 #0F102B 93.08%
               ), 
               white`,
        `linear-gradient(
                 29.53deg, 
                 #9528F7 2.94%, 
                 #522DE7 39.91%, 
                 #221A71 76.87%, 
                 #0F102B 93.08%
               ), 
               black`
      )}
      bgRepeat="no-repeat, repeat"
      bgSize="100% 530px, 100% 100%"
    >
      {children}
    </Flex>
  );
}

export function PageWrapper({
  tokenPrice,
  children,
  statusBarContent,
}: {
  tokenPrice: TokenPrice;
  children: ReactNode;
  statusBarContent: IncidentContent;
}) {
  const isTestnet = useGlobalContext().activeNetwork.mode === 'testnet';
  const incidentsToShow = statusBarContent?.items?.filter(
    alert => (alert.fields.showOnTestnet && isTestnet) || (alert.fields.showOnMainnet && !isTestnet)
  );

  const statusBarBg = useColorModeValue('black', 'white');
  const colorMode = useColorMode().colorMode;

  return (
    <>
      <Flex
        direction={'column'}
        width={'100%'}
        top={'0'}
        backdropFilter={'blur(10px)'}
        background={statusBarBg}
      >
        <IncidentsStatusBarWithErrorBoundary />
        <CMSStatusBars statusBarContent={statusBarContent} />
      </Flex>
      <NakamotoModal />
      <WrapperWithBg>
        <Flex mx="auto" width="full" maxWidth="container.xl" flexDirection="column" p={6}>
          <NavBar tokenPrice={tokenPrice} />
          <Flex direction={'column'} mt={10} gap={7}>
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
