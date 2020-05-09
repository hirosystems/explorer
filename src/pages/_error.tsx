import * as React from 'react';
import { NextPageContext } from 'next';
import { PageWrapper } from '@components/page';
import { Text, Title } from '@components/typography';
import { Flex, Box, Stack, BoxProps } from '@blockstack/ui';
import { FormLabel } from '@components/debug/common';
import { SearchBarWithDropdown } from '@components/search-bar';
import NextLink from 'next/link';
import { navgiateToRandomTx } from '@common/utils';
import { Meta } from '@components/meta-head';

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

const Error = ({ statusCode }: { statusCode?: number }) => {
  return (
    <PageWrapper>
      <Meta title={`${statusCode} error - Stacks Explorer`} />
      <Flex
        maxWidth="700px"
        flexDirection="column"
        align="flex-start"
        justify="center"
        flexGrow={1}
      >
        <Title mb="base" as="h1" fontSize="36px">
          Whoops! something went wrong.
        </Title>
        <Text maxWidth="490px">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client.'}
          Please feel free to{' '}
          <Link
            // @ts-ignore
            href="https://github.com/blockstack/explorer/issues/new"
            target="_blank"
          >
            file an issue
          </Link>
          .
        </Text>
        <Box pb="loose" mt="loose" width="100%" maxWidth="544px">
          <FormLabel pb="tight">Search for a transaction</FormLabel>
          <SearchBarWithDropdown />
        </Box>
        <Stack isInline>
          <Box>
            <NextLink href="/" passHref>
              <Link textDecoration="underline" fontSize="14px">
                Explorer homepage
              </Link>
            </NextLink>
          </Box>
          <Box>
            <Link textDecoration="underline" fontSize="14px" onClick={navgiateToRandomTx}>
              Random transaction
            </Link>
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
