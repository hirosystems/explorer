import * as React from 'react';
import { NextPageContext } from 'next';
import { PageWrapper } from '@components/page';
import { Text, Title } from '@components/typography';
import { Flex, Box, Stack, BoxProps } from '@blockstack/ui';
import { FormLabel } from '@components/sandbox/common';
import { SearchBarWithDropdown } from '@components/search-bar';
import NextLink from 'next/link';
import { Meta } from '@components/meta-head';
import { useNavigateToRandomTx } from '@common/hooks/use-random-tx';
import * as Sentry from '@sentry/node';
import Error from 'next/error';

const Link = ({ href, target, ...rest }: { href?: string; target?: string } & BoxProps) => {
  return (
    <Text
      as="a"
      textDecoration="underline"
      // @ts-ignore
      href={href}
      _hover={{
        color: 'var(--colors-text-hover)',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
      target={target}
      {...rest}
    />
  );
};

const ExplorerError = ({
  statusCode,
  hasGetInitialPropsRun,
  err,
}: {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}) => {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/zeit/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err);
  }

  const navigateToRandomTx = useNavigateToRandomTx();

  return (
    <PageWrapper>
      <Meta title={`Whoops! - Stacks Explorer`} />
      <Flex
        maxWidth="700px"
        flexDirection="column"
        align="flex-start"
        justify="center"
        flexGrow={1}
      >
        <Title mb="base" as="h1" fontSize="36px">
          Whoops! something went wrong
        </Title>
        <Text maxWidth="490px">
          {statusCode ? `An error occurred on the server.` : 'An error occurred on the client.'}{' '}
          Please feel free to{' '}
          <Link
            // @ts-ignore
            href="https://github.com/blockstack/explorer/issues/new"
            target="_blank"
          >
            file an issue
          </Link>
          and describe: what you were attempting to do, the URL you are trying, and anything that is
          in the console.
        </Text>
        <Box pb="loose" mt="loose" width="100%" maxWidth="544px">
          <FormLabel pb="tight">Search for a transaction</FormLabel>
          <SearchBarWithDropdown />
        </Box>
        <Stack isInline>
          <Box>
            <NextLink href="/" passHref>
              <Link textDecoration="underline" fontSize="14px">
                Back home
              </Link>
            </NextLink>
          </Box>
          <Box>
            <Link textDecoration="underline" fontSize="14px" onClick={navigateToRandomTx}>
              Random transaction
            </Link>
          </Box>
        </Stack>
      </Flex>
    </PageWrapper>
  );
};

ExplorerError.getInitialProps = async ({
  res,
  err,
  pathname,
  query,
  AppTree,
  isServer,
  store,
}: NextPageContext) => {
  const errorInitialProps = await Error.getInitialProps({
    res,
    err,
    pathname,
    query,
    AppTree,
    isServer,
    store,
  });

  // Workaround for https://github.com/zeit/next.js/issues/8592, mark when
  // getInitialProps has run
  // @ts-ignore
  errorInitialProps.hasGetInitialPropsRun = true;

  if (res && res.statusCode === 404) {
    return { statusCode: 404 };
  } else if (err) {
    Sentry.captureException(err);
  } else {
    Sentry.captureException(
      new Error({
        statusCode: 400,
        title: `_error.js getInitialProps missing data at path: ${pathname}`,
      })
    );
  }

  return errorInitialProps;
};

export default ExplorerError;
