import React from 'react';
import { Box, BoxProps, Flex, FlexProps } from '@blockstack/ui';

import { Header } from '@components/header';
import { TransactionTitle, TitleProps } from '@components/transaction-title';
import { Footer } from '@components/footer';
import { Notice } from '@components/notice';
import { Alert } from '@components/alert';
import { css } from '@styled-system/css';
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

export const Page = React.memo(
  ({
    children,
    notice,
    fullWidth,
    ...rest
  }: { notice?: { label?: string; message?: string }; fullWidth?: boolean } & BoxProps) => (
    <Flex
      css={css({
        '*::selection': {
          color: 'white',
          background: color('accent'),
          transition: 'all 0.12s ease-in-out',
        },
      })}
      flexDirection="column"
      width="100%"
      minHeight="100%"
      pt="64px"
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
  )
);

export const PageWrapper = React.memo(
  (props: { isHome?: boolean; fullWidth?: boolean; notice?: any } & FlexProps) => (
    <>
      <Header fullWidth={props.fullWidth} isHome={props.isHome} />
      <Page pt="extra-loose" {...props} />
    </>
  )
);
