import React from 'react';
import { Box, BoxProps, Flex, FlexProps } from '@blockstack/ui';

import { Header } from '@components/header';
import { TransactionTitle, TitleProps } from '@components/transaction-title';
import { Footer } from '@components/footer';
import { Notice } from '@components/notice';

export const PageTop: React.FC<TitleProps> = ({ status, type, ...props }) => (
  <Box width="100%" mb={['loose', 'loose', 'extra-loose']} {...props}>
    <TransactionTitle status={status} type={type} />
  </Box>
);

interface PageProps extends BoxProps {
  notice?: { label?: string; message?: string };
  fullWidth?: boolean;
}
export const Page = ({ children, fullWidth, notice, ...rest }: PageProps) => {
  const widthProps = fullWidth
    ? {}
    : {
        maxWidth: '1280px',
      };
  return (
    <Flex flexDirection="column" width="100%" minHeight="100%" pt="64px">
      {notice ? (
        <Notice fullWidth={fullWidth} label={notice.label} message={notice.message} />
      ) : null}
      <Flex
        as="main"
        mx="auto"
        width="100%"
        flexGrow={1}
        height="100%"
        flexDirection="column"
        px={['base', 'base', 'extra-loose']}
        {...widthProps}
        {...rest}
      >
        {children}
      </Flex>
      <Footer
        mx="auto"
        width="100%"
        mt="extra-loose"
        mb={['base', 'base', 'extra-loose']}
        px={['base', 'base', 'extra-loose']}
        {...widthProps}
      />
    </Flex>
  );
};

interface PageWrapperProps extends PageProps {
  isHome?: boolean;
}

export const PageWrapper = ({ isHome, fullWidth, ...rest }: PageWrapperProps & FlexProps) => (
  <>
    <Header fullWidth={fullWidth} isHome={isHome} />
    <Page pt="extra-loose" fullWidth={fullWidth} {...rest} />
  </>
);
