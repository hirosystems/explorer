import React from 'react';
import { Box, Flex, FlexProps, transition, color, useColorMode } from '@stacks/ui';
import { css, Theme } from '@stacks/ui-core';

import { Footer } from '@components/footer';
import { Header } from '@components/header';
import { Notice } from '@components/notice';
import { MetaverseBg } from '@components/metaverse-bg';

import { TitleProps, TransactionTitle } from '@components/transaction-title';
import { Alert } from '@components/alert';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

type PageProps = {
  notice?: { label?: string; message?: string };
  fullWidth?: boolean;
  tx?: Transaction;
} & FlexProps;
type PageWrapperProps = {
  isHome?: boolean;
  fullWidth?: boolean;
  notice?: any;
  networkMode?: string;
} & FlexProps;

export const PageTop: React.FC<TitleProps> = ({ tx, ...props }) => {
  const status = tx.tx_status;
  const failed = status === 'abort_by_response' || status === 'abort_by_post_condition';

  const failedMessage =
    status === 'abort_by_response'
      ? 'This transaction did not succeed because the transaction was aborted during its execution.'
      : 'This transaction would have succeeded, but was rolled back by a supplied post-condition.';

  return (
    <Box width="100%" {...props}>
      <TransactionTitle mb="loose" tx={tx} />
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

export const Page: React.FC<PageProps> = React.memo(({ children, notice, fullWidth, ...rest }) => (
  <Flex
    css={(theme: Theme) =>
      css({
        '*::selection': {
          color: 'white',
          background: color('accent'),
          transition: 'all 0.12s ease-in-out',
        },
      })(theme)
    }
    flexDirection="column"
    width="100%"
    minHeight="100%"
    position="relative"
    zIndex={2}
    flexGrow={1}
  >
    <Box px="base-loose">
      <Notice
        label="Notice"
        message="We are investigating an issue where our API does not return blockchain information after block #119."
      />
    </Box>
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

export const PageWrapper: React.FC<PageWrapperProps> = ({
  networkMode,
  fullWidth,
  isHome,
  ...props
}) => (
  <Flex
    maxWidth="100vw"
    overflowX="hidden"
    bg={color('bg')}
    flexDirection="column"
    minHeight="100vh"
    position="relative"
  >
    <Header fullWidth={fullWidth} isHome={isHome} />
    <Page {...props} />
    <MetaverseBg />
  </Flex>
);
