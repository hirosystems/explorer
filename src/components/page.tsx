import React from 'react';
import { Box, Flex, FlexProps, transition } from '@stacks/ui';
import { css, Theme } from '@stacks/ui-core';

import { Footer } from '@components/footer';
import { Header } from '@components/header';
import { Notice } from '@components/notice';
import { color } from '@components/color-modes';
import { TitleProps, TransactionTitle } from '@components/transaction-title';
import { MetaverseSVG } from '@components/metaverse';
import { Alert } from '@components/alert';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

type PageProps = {
  notice?: { label?: string; message?: string };
  fullWidth?: boolean;
  tx?: Transaction;
} & FlexProps;
type PageWrapperProps = { isHome?: boolean; fullWidth?: boolean; notice?: any } & FlexProps;

export const PageTop: React.FC<TitleProps> = ({ tx, ...props }) => {
  const type = tx.tx_type;
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

export const PageWrapper: React.FC<PageWrapperProps> = ({ fullWidth, isHome, ...props }) => (
  <Flex flexDirection="column" minHeight="100vh" position="relative">
    <Header fullWidth={fullWidth} isHome={isHome} />
    <Page {...props} />
    <Box
      className="metaverse-header"
      position="absolute"
      zIndex={-1}
      width="100%"
      top={0}
      height="420px"
      overflow="hidden"
      transition={transition}
    >
      <Box transform="translate3d(-3%, -16%, 0) scale(1.15) rotate(-8deg)" position="relative">
        <MetaverseSVG minWidth="1400px" width="100vw" filter="contrast(1.1)" />
      </Box>
    </Box>
  </Flex>
);
