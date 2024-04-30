'use client';

import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { AddNetworkModal } from '../../common/components/modals/AddNetwork';
import { NakamotoModal } from '../../common/components/modals/Nakamoto';
import { TokenPrice } from '../../common/types/tokenPrice';
import { Flex } from '../../ui/Flex';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { NetworkModeToast } from './NetworkModeToast';
import { IncidentsStatusBarWithErrorBoundary } from './StatusBar';

function WrapperWithBg({ children }: { children: ReactNode }) {
  return (
    <Flex
      paddingTop={4}
      px={4}
      background={'surface'}
      direction="column"
    >
      <Flex
        className="header-bg"
        maxWidth="100vw"
        minHeight="100vh"
        overflowX="hidden"
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
                 rgba(149, 40, 247, 0.5) 2.94%,  
                 rgba(82, 45, 231, 0.5) 39.91%,   
                 rgba(34, 26, 113, 0.5) 76.87%,   
                 rgba(15, 16, 43, 0.5) 93.08%
               ), 
               black`
        )}
        bgRepeat="no-repeat, repeat"
        bgSize="100% 530px, 100% 100%"
      >
        {children}
      </Flex>
    </Flex>
  );
}

export function PageWrapper({
  tokenPrice,
  children,
}: {
  tokenPrice: TokenPrice;
  children: ReactNode;
}) {
  return (
    <>
      <IncidentsStatusBarWithErrorBoundary />
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
