import React from 'react';
import { Box, BoxProps, Flex } from '@blockstack/ui';

import { Header } from '@components/header';
import { TransactionTitle, TitleProps } from '@components/transaction-title';
import { FooterLinks } from '@components/footer-links';
import { Notice } from '@components/notice';

export const PageTop: React.FC<TitleProps> = ({ status, type, ...props }) => (
  <Box width="100%" {...props}>
    <TransactionTitle mb="extra-loose" status={status} type={type} />
  </Box>
);

export const Page = ({ children, notice, ...rest }: { notice?: any } & BoxProps) => (
  <Flex flexDirection="column" width="100%" minHeight="100%" pt="64px">
    {notice ? <Notice>{notice}</Notice> : null}
    <Flex
      as="main"
      mx="auto"
      width="100%"
      flexGrow={1}
      height="100%"
      maxWidth="1280px"
      flexDirection="column"
      px={['base', 'base', 'extra-loose']}
      {...rest}
    >
      <>
        {children}
        <FooterLinks mt="extra-loose" />
      </>
    </Flex>
  </Flex>
);

export const PageWrapper = (props: { isHome?: boolean; notice?: any } & BoxProps) => (
  <>
    <Header isHome={props.isHome} />
    <Page pt="extra-loose" {...props} />
  </>
);
