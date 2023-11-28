'use client';

import { useColorMode } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

import { AddNetworkModal } from '../../common/components/modals/AddNetwork';
import { PAGE_MAX_WIDTH } from '../../common/constants/constants';
import {
  SITE_NOTICE_BANNER_LABEL,
  SITE_NOTICE_BANNER_MESSAGE,
  SITE_NOTICE_ENABLED,
} from '../../common/constants/env';
import { Search } from '../../features/search/Search';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { NetworkModeToast } from './NetworkModeToast';
import { Notice } from './Notice';
import { StatusBar } from './StatusBar';

export const PageWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const colorMode = useColorMode().colorMode;

  return (
    <Box bg={colorMode === 'light' ? '#fff' : 'rgb(4, 4, 4)'}>
      <Box position={'sticky'} width={'100%'} top={'0'} backdropFilter={'blur(10px)'} zIndex={2}>
        <StatusBar />
      </Box>
      <Flex
        maxWidth="100vw"
        overflowX="hidden"
        flexDirection="column"
        minHeight="100vh"
        position="relative"
        overflow="hidden"
        style={
          colorMode === 'light'
            ? {
                background: `linear-gradient(
                 29.53deg, 
                 #9528F7 2.94%, 
                 #522DE7 39.91%, 
                 #221A71 76.87%, 
                 #0F102B 93.08%
               ), 
               white`,
                backgroundRepeat: 'no-repeat, repeat',
                backgroundSize: '100% 530px, 100% 100%',
              }
            : undefined
        }
      >
        <Box>
          <NavBar />
          <Flex
            display={['block', 'block', 'none', 'none']}
            p="8px"
            mx="auto"
            width="100%"
            flexDirection={'column'}
            px={'16px'}
          >
            <Search variant="small" mr="16px" width="100%" maxWidth="760px" />
          </Flex>
          <Flex
            flexDirection="column"
            width="100%"
            minHeight="100%"
            position="relative"
            flexGrow={1}
          >
            {SITE_NOTICE_ENABLED && (
              <Box px="20px">
                <Notice label={SITE_NOTICE_BANNER_LABEL} message={SITE_NOTICE_BANNER_MESSAGE} />
              </Box>
            )}
            <Flex
              as="main"
              mx="auto"
              width="100%"
              flexGrow={1}
              height="100%"
              maxWidth={PAGE_MAX_WIDTH}
              flexDirection="column"
              px={['16px', '16px', '32px']}
            >
              {children}
            </Flex>
            <Footer />
          </Flex>
        </Box>
      </Flex>
      <AddNetworkModal />
      <NetworkModeToast />
    </Box>
  );
};
