'use client';

import {
  SITE_NOTICE_BANNER_LABEL,
  SITE_NOTICE_BANNER_MESSAGE,
  SITE_NOTICE_ENABLED,
} from '@/common/constants';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Modals } from '@/components/modals';
import { NetworkModeToast } from '@/components/network-mode-toast';
import { Notice } from '@/components/notice';
import { SearchComponent } from '@/features/search/search';
import { AlertBarBase, Indicator, StatusBar } from '@/features/status-bar/status-bar';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { ListItem } from '@/ui/ListItem';
import { Text } from '@/ui/Text';
import { TextLink } from '@/ui/TextLink';
import { UnorderedList } from '@/ui/UnorderedList';
import { useColorMode } from '@chakra-ui/react';
import React, { FC } from 'react';

export const PageWrapper: FC = ({ children }) => {
  const colorMode = useColorMode().colorMode;

  return (
    <>
      <Flex
        maxWidth="100vw"
        // overflowX="hidden"
        flexDirection="column"
        minHeight="100vh"
        position="relative"
        // overflow="hidden"
        style={{
          backgroundAttachment: 'fixed',
          backgroundImage:
            colorMode === 'light'
              ? 'linear-gradient(transparent, transparent 530px, white 530px), linear-gradient(30deg, rgb(98, 135, 221), rgb(231, 72, 92) 58%, rgb(102, 137, 221) 100%)'
              : undefined,
        }}
      >
        <Box position={'sticky'} top={'0'} zIndex={2}>
          <StatusBar />
          <AlertBarBase
            indicator={Indicator.major}
            content={
              <Flex direction={'column'} gap={'8px'} flexGrow={1}>
                <Text fontWeight={700} fontSize={'15px'} lineHeight={'1.2'}>
                  Stacks network upgrade
                </Text>
                <UnorderedList
                  // paddingLeft={'8px'}
                  fontWeight={400}
                  fontSize={'12px'}
                  lineHeight={'1.25'}
                  // color={'#303030'}
                >
                  <ListItem>
                    The Stacks network will be undergoing two hard-forks, as{' '}
                    <TextLink
                      display="inline"
                      href="https://github.com/stacksgov/sips/blob/main/sips/sip-022/sip-022-emergency-pox-fix.md"
                      target="_blank"
                      // color={'#1068BF'}
                      // borderBottom={'1px solid #1068BF'}
                    >
                      outlined in SIP-022
                    </TextLink>
                    .
                  </ListItem>
                  <ListItem>
                    This update will require miners and operators to upgrade to{' '}
                    <TextLink
                      display="inline"
                      href="https://github.com/stacks-network/stacks-blockchain/releases/tag/2.4.0.0.0"
                      target="_blank"
                      // color={'#1068BF'}
                      // borderBottom={'1px solid #1068BF'}
                    >
                      stacks-node version 2.4.0.0.0
                    </TextLink>
                    .
                  </ListItem>
                  <ListItem>
                    Stacking will be re-enabled with this release. For more details,{' '}
                    <TextLink
                      display="inline"
                      href="https://forum.stacks.org/t/stacks-2-4-is-here-stacking-to-be-re-enabled/15024"
                      target="_blank"
                      // color={'#1068BF'}
                      // borderBottom={'1px solid #1068BF'}
                    >
                      see this post
                    </TextLink>
                    .
                  </ListItem>
                </UnorderedList>
              </Flex>
            }
          />
        </Box>
        <Header fullWidth={true} />
        <Flex
          display={['block', 'block', 'none', 'none']}
          p="8px"
          mx="auto"
          width="100%"
          flexDirection={'column'}
          px={'16px'}
        >
          <SearchComponent variant="small" mr="16px" width="100%" maxWidth="760px" />
        </Flex>
        <Flex flexDirection="column" width="100%" minHeight="100%" position="relative" flexGrow={1}>
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
            maxWidth={'1280px'}
            flexDirection="column"
            px={['16px', '16px', '32px']}
          >
            {children}
          </Flex>
          <Footer />
        </Flex>
      </Flex>
      <Modals />
      <NetworkModeToast />
    </>
  );
};
