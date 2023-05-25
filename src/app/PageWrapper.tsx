// @ts-nocheck
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
import { FC, ReactNode } from 'react';
import { Entry } from 'contentful';
import { BLOCKS, MARKS, Block, Inline, INLINES, CONTAINERS } from '@contentful/rich-text-types';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';

interface Node {
  content: ReactNode;
}

const richTextRenderOptions = (origin: string): Options => ({
  renderMark: {
    [MARKS.BOLD]: (text: string) => <b>{text}</b>,
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node: Block | Inline, children: ReactNode) => (
      <Text fontWeight={700} fontSize={'15px'} lineHeight={'1.2'}>
        {children}
      </Text>
    ),
    [BLOCKS.HEADING_2]: (node: Block | Inline, children: ReactNode) => (
      <Text fontWeight={700} fontSize={'15px'} lineHeight={'1.2'}>
        {children}
      </Text>
    ),
    [BLOCKS.HEADING_3]: (node: Block | Inline, children: ReactNode) => (
      <Text fontWeight={700} fontSize={'15px'} lineHeight={'1.2'}>
        {children}
      </Text>
    ),
    [BLOCKS.HEADING_4]: (node: Block | Inline, children: ReactNode) => (
      <Text fontWeight={700} fontSize={'15px'} lineHeight={'1.2'}>
        {children}
      </Text>
    ),
    [BLOCKS.HEADING_5]: (node: Block | Inline, children: ReactNode) => (
      <Text fontWeight={700} fontSize={'15px'} lineHeight={'1.2'}>
        {children}
      </Text>
    ),
    [BLOCKS.HEADING_6]: (node: Block | Inline, children: ReactNode) => (
      <Text fontWeight={700} fontSize={'15px'} lineHeight={'1.2'}>
        {children}
      </Text>
    ),
    [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: ReactNode) => (
      <Text fontWeight={400} fontSize={'12px'} lineHeight={'1.25'}>
        {children}
      </Text>
    ),
    [BLOCKS.UL_LIST]: (node: Block | Inline, children: ReactNode) => (
      <UnorderedList fontWeight={400} fontSize={'12px'} lineHeight={'1.25'}>
        {children}
      </UnorderedList>
    ),
    [BLOCKS.LIST_ITEM]: (node: Block | Inline, children: ReactNode) => (
      <ListItem>{children}</ListItem>
    ),
    [INLINES.HYPERLINK]: ({ data }: Block | Inline, children: ReactNode) => (
      <TextLink
        display="inline"
        href={data.uri}
        target={data.uri.startsWith(origin) ? '_self' : '_blank'}
        rel={data.uri.startsWith(origin) ? '' : 'noopener noreferrer'}
        _hover={{ textDecoration: 'underline' }}
      >
        {children}
      </TextLink>
    ),
  },
});

export const PageWrapper: FC<{ content?: { items: Entry[] } }> = ({ children, content }) => {
  const colorMode = useColorMode().colorMode;
  const origin =
    typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  console.log('content', content, origin);

  return (
    <>
      <Flex
        maxWidth="100vw"
        flexDirection="column"
        minHeight="100vh"
        position="relative"
        style={{
          backgroundAttachment: 'fixed',
          backgroundImage:
            colorMode === 'light'
              ? 'linear-gradient(transparent, transparent 530px, white 530px), linear-gradient(30deg, rgb(98, 135, 221), rgb(231, 72, 92) 58%, rgb(102, 137, 221) 100%)'
              : undefined,
        }}
      >
        <Box position={'sticky'} width={'100%'} top={'0'} backdropFilter={'blur(10px)'} zIndex={2}>
          <StatusBar />
          {content?.items?.map(alert => (
            <AlertBarBase
              key={alert.sys.id}
              indicator={alert.fields.severity as Indicator}
              content={
                <Flex direction={'column'} gap={'8px'} flexGrow={1}>
                  {documentToReactComponents(alert.fields.content, richTextRenderOptions(origin))}
                </Flex>
              }
            />
          ))}
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
