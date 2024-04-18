'use client';

import { useColorModeValue } from '@chakra-ui/react';
import { css } from '@emotion/react';
import React, { ReactNode } from 'react';
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
            >
              A new version{' '}
              <TextLink
                href="https://github.com/stacks-network/stacks-core/releases/tag/2.5.0.0.2"
                target="_blank"
                css={css`
                  display: inline;
                  text-decoration: underline;
                `}
              >
                2.5.0.0.2
              </TextLink>{' '}
              of the Stacks Blockchain has been released.
              <br />
              This kicks off the 1st step of the 2 part{' '}
              <TextLink
                href="https://docs.stacks.co/nakamoto-upgrade/nakamoto-rollout-plan"
                target="_blank"
                css={css`
                  display: inline;
                  text-decoration: underline;
                `}
              >
                Nakamoto launch process
              </TextLink>
              , and instantiates the pox-4 contract. This release will activate on ~April 22 at
              Bitcoin block 840,360!
            </Text>
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
