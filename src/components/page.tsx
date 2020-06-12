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
  ({ children, notice, ...rest }: { notice?: { label?: string; message?: string } } & BoxProps) => (
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
        maxWidth="1280px"
        flexDirection="column"
        px={['base', 'base', 'extra-loose']}
        {...rest}
      >
        {children}
      </Flex>
      <Footer
        mx="auto"
        width="100%"
        maxWidth="1280px"
        mt="extra-loose"
        mb={['base', 'base', 'extra-loose']}
        px={['base', 'base', 'extra-loose']}
      />
    </Flex>
  )
);

export const PageWrapper = React.memo((props: { isHome?: boolean; notice?: any } & FlexProps) => (
  <>
    <Header isHome={props.isHome} />
    <Page pt="extra-loose" {...props} />
  </>
));
