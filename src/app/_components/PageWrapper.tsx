'use client';

import { useColorModeValue } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { IncidentImpact } from 'statuspage.io';

import { AddNetworkModal } from '../../common/components/modals/AddNetwork';
import { NakamotoModal } from '../../common/components/modals/Nakamoto';
import { TokenPrice } from '../../common/types/tokenPrice';
import { Flex } from '../../ui/Flex';
import { Text } from '../../ui/Text';
import { TextLink } from '../../ui/TextLink';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { NetworkModeToast } from './NetworkModeToast';
import { IncidentsStatusBarWithErrorBoundary } from './StatusBar';
import { StatusBarBase } from './StatusBar/StatusBarBase';
import { getColor } from './StatusBar/utils';

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
}: {
  tokenPrice: TokenPrice;
  children: ReactNode;
}) {
  return (
    <>
      <IncidentsStatusBarWithErrorBoundary />
      <StatusBarBase
        impact={IncidentImpact.None}
        content={
          <Flex>
            <Text
              color={getColor(IncidentImpact.None)}
              fontWeight={'medium'}
              fontSize={'14px'}
              lineHeight={'1.5'}
              display={'inline'}
            >
              <Text fontWeight={'bold'} display={'inline'}>
                Testnet Update:
              </Text>{' '}
              Primary Testnet is now Live and ready to use. More details{' '}
              <TextLink
                href="https://docs.stacks.co/nakamoto-upgrade/nakamoto-and-primary-testnet"
                target="_blank"
                css={css`
                  display: inline;
                  text-decoration: underline;
                `}
              >
                here
              </TextLink>
              .
            </Text>
            &nbsp;
          </Flex>
        }
      />
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
