import React, { useState } from 'react';
import Link from 'next/link';
import { Box, BoxProps, Flex } from '@blockstack/ui';
import { TransactionTitle, TitleProps } from '@components/transaction-title';
import { BlockstackLogo } from '@components/icons/blockstack-logo';
import { search } from '@common/search';
import { SearchBarWithDropdown } from '@components/search-bar';

export const PageWrapper: React.FC<BoxProps> = props => {
  const [query, setQuery] = useState('');

  const handleQueryUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const updateQuery = React.useCallback(handleQueryUpdate, []);

  return (
    <>
      <Flex
        as="form"
        onSubmit={search(query)}
        height="64px"
        flexDirection="row"
        alignItems="center"
        boxShadow="0px 1px 2px rgba(27, 39, 51, 0.04), 0px 4px 8px rgba(27, 39, 51, 0.04);"
      >
        <Link href="/" passHref>
          <a aria-label="Homepage" title="Stacks Explorer Homepage">
            <BlockstackLogo m="base-loose" />
          </a>
        </Link>
        <SearchBarWithDropdown onChange={updateQuery} />
      </Flex>
      <Box
        pb="extra-loose"
        mb="extra-loose"
        px="base"
        maxWidth="1100px"
        mx="auto"
        pt={16}
        {...props}
      />
    </>
  );
};

export const PageTop: React.FC<TitleProps> = ({ status, type, ...props }) => (
  <Box width="100%" {...props}>
    <TransactionTitle mb="extra-loose" status={status} type={type} />
  </Box>
);

export const Page: React.FC = ({ children }) => (
  <Box as="main" height="100%" maxWidth="1280px" mx="auto">
    <Flex flexDirection="column" height="100%" mx={['base', 'extra-loose']}>
      {children}
    </Flex>
  </Box>
);
