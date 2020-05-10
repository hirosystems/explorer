import * as React from 'react';
import { Flex, Box, Stack, BoxProps } from '@blockstack/ui';
import { PageWrapper } from '@components/page';
import { Text, Title } from '@components/typography';
import { FormLabel } from '@components/debug/common';
import { SearchBarWithDropdown } from '@components/search-bar';
import NextLink from 'next/link';
import { Meta } from '@components/meta-head';
import { useNavigateToRandomTx } from '@common/hooks/use-random-tx';

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

const NotFound = () => {
  const handleRandomTxClick = useNavigateToRandomTx();

  return (
    <PageWrapper>
      <Meta title="Page not found - Stacks Explorer" />
      <Flex
        maxWidth="700px"
        flexDirection="column"
        align="flex-start"
        justify="center"
        flexGrow={1}
      >
        <Title mb="base" as="h1" fontSize="36px">
          Page not found!
        </Title>
        <Text maxWidth="490px">
          Something went wrong, this page doesn't seem to exist. If you think this is an error,{' '}
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
            <Link textDecoration="underline" fontSize="14px" onClick={handleRandomTxClick}>
              Random transaction
            </Link>
          </Box>
        </Stack>
      </Flex>
    </PageWrapper>
  );
};

export default NotFound;
