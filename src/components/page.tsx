import React from 'react';
import { Box, Flex, FlexProps } from '@stacks/ui';

import { Header } from '@components/header';
import { TransactionTitle, TitleProps } from '@components/transaction-title';
import { Footer } from '@components/footer';
import { Notice } from '@components/notice';
import { Alert } from '@components/alert';
import { color } from '@components/color-modes';

export const PageTop: React.FC<TitleProps> = ({ status, type, ...props }) => {
  const failed = status === 'abort_by_response' || status === 'abort_by_post_condition';

  const failedMessage =
    status === 'abort_by_response'
      ? 'This transaction did not succeed because the transaction was aborted during its execution.'
      : 'This transaction would have succeeded, but was rolled back by a supplied post-condition.';

  return (
    <Box width="100%" {...props}>
      <TransactionTitle mb="loose" status={status} type={type} />
      {failed ? (
        <Alert
          mb="base"
          error={{
            name: 'Notice',
            message: failedMessage,
          }}
        />
      ) : null}
    </Box>
  );
};
type PageProps = { notice?: { label?: string; message?: string }; fullWidth?: boolean } & FlexProps;
export const Page: React.FC<PageProps> = React.memo(({ children, notice, fullWidth, ...rest }) => (
  <Flex
    css={{
      '*::selection': {
        color: 'white',
        background: color('accent'),
        transition: 'all 0.12s ease-in-out',
      },
    }}
    flexDirection="column"
    width="100%"
    minHeight="100%"
    position="relative"
    zIndex={2}
    flexGrow={1}
  >
    {notice ? <Notice label={notice.label} message={notice.message} /> : null}
    <Flex
      as="main"
      mx="auto"
      width="100%"
      flexGrow={1}
      height="100%"
      maxWidth={fullWidth ? '100%' : '1280px'}
      flexDirection="column"
      px={['base', 'base', 'extra-loose']}
      {...rest}
    >
      {children}
    </Flex>
    <Footer
      mx="auto"
      width="100%"
      maxWidth={fullWidth ? '100%' : '1280px'}
      mt={fullWidth ? 'unset' : 'extra-loose'}
      mb={['base', 'base', 'extra-loose']}
      px={fullWidth ? 'unset' : ['base', 'base', 'extra-loose']}
      fullWidth={fullWidth}
    />
  </Flex>
));
type PageWrapperProps = { isHome?: boolean; fullWidth?: boolean; notice?: any } & FlexProps;

export const PageWrapper: React.FC<PageWrapperProps> = ({ fullWidth, isHome, ...props }) => (
  <Flex flexDirection="column" minHeight="100vh" position="relative">
    <Box position="absolute" left={0} top={0} width="100%" height="480px" bg="ink" zIndex={0} />
    <Header fullWidth={fullWidth} isHome={isHome} />
    <Page {...props} />
  </Flex>
);
