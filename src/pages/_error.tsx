import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import { PageWrapper } from '@components/page';
import { Text, Title } from '@components/typography';
import { Flex, Box, Stack } from '@stacks/ui';
import { SearchBarWithDropdown } from '@components/search-bar';
import NextLink from 'next/link';
import { Meta } from '@components/meta-head';
import { Link } from '@components/link';

const Error: NextPage<{ statusCode?: number }> = ({ statusCode }) => {
  return (
    <PageWrapper>
      <Meta title="Whoops! - Stacks Explorer" />
      <Flex
        maxWidth="700px"
        flexDirection="column"
        alignItems="flex-start"
        justify="center"
        flexGrow={1}
      >
        <Title mb="base" as="h1" fontSize="36px">
          Whoops! something went wrong
        </Title>
        <Text maxWidth="490px">
          {statusCode ? `An error occurred on the server.` : 'An error occurred on the client.'}{' '}
          Please feel free to{' '}
          <Link href="https://github.com/blockstack/explorer/issues/new" target="_blank">
            file an issue
          </Link>{' '}
          and describe: what you were attempting to do, the URL you are trying, and anything that is
          in the console.
        </Text>
        <Stack isInline>
          <Box>
            <NextLink href="/" passHref>
              <Link textDecoration="underline" fontSize="14px">
                Back home
              </Link>
            </NextLink>
          </Box>
        </Stack>
      </Flex>
    </PageWrapper>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
