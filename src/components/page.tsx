import React, { useState } from 'react';
import Link from 'next/link';
import { Box, BoxProps, Flex } from '@blockstack/ui';

import { TransactionTitle, TitleProps } from '@components/transaction-title';
import { BlockstackLogo } from '@components/icons/blockstack-logo';
import { SearchBar } from '@components/search-bar';
import { search } from '@common/search';

export const PageWrapper: React.FC<BoxProps> = props => {
  const [query, setQuery] = useState('');
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
          <a>
            <BlockstackLogo m="base-loose" />
          </a>
        </Link>

        <SearchBar
          onChange={e => setQuery(e.target.value)}
          height="40px"
          inputOffset="36px"
          width={['100%', '100%', '320px']}
          backgroundColor="#F0F0F5"
          fontSize="14px"
          mr="base-loose"
        />
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
