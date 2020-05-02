import React from 'react';
import { Box, BoxProps, Flex } from '@blockstack/ui';

import { Header } from '@components/header';
import { TransactionTitle, TitleProps } from '@components/transaction-title';
import { FooterLinks } from '@components/footer-links';

export const PageTop: React.FC<TitleProps> = ({ status, type, ...props }) => (
  <Box width="100%" {...props}>
    <TransactionTitle mb="extra-loose" status={status} type={type} />
  </Box>
);

export const Page: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Flex flexDirection="column" width="100%" minHeight="100%">
    <Flex
      as="main"
      mx="auto"
      width="100%"
      flexGrow={1}
      height="100%"
      maxWidth="1280px"
      flexDirection="column"
      px={['tight', 'base', 'extra-loose']}
      {...rest}
    >
      <>
        {children}
        <FooterLinks mt="extra-loose" />
      </>
    </Flex>
  </Flex>
);

export const PageWrapper: React.FC<BoxProps> = props => (
  <>
    <Header />
    <Page pt="extra-loose" mt="64px" {...props} />
  </>
);
