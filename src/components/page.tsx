import React, { useState } from 'react';
import Link from 'next/link';
import { Box, BoxProps, Flex } from '@blockstack/ui';
import { TransactionTitle, TitleProps } from '@components/transaction-title';
import { BlockstackLogo } from '@components/icons/blockstack-logo';
import { search } from '@common/search';
import { SearchBarWithDropdown } from '@components/search-bar';
import { FooterLinks } from '@components/footer-links';

export const PageTop: React.FC<TitleProps> = ({ status, type, ...props }) => (
  <Box width="100%" {...props}>
    <TransactionTitle mb="extra-loose" status={status} type={type} />
  </Box>
);

export const Page: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Flex flexDirection="column" width="100%" minHeight="100%">
    <Flex
      as="main"
      height="100%"
      maxWidth="1280px"
      mx="auto"
      flexGrow={1}
      width="100%"
      flexDirection="column"
      px={['base', 'extra-loose']}
      {...rest}
    >
      <>
        {children}
        <FooterLinks mt="extra-loose" />
      </>
    </Flex>
  </Flex>
);

const Header = (props: any) => {
  const [query, setQuery] = useState('');

  const handleQueryUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const updateQuery = React.useCallback(handleQueryUpdate, []);
  return (
    <Flex
      as="form"
      onSubmit={search(query)}
      height="64px"
      flexDirection="row"
      alignItems="center"
      boxShadow="0px 1px 2px rgba(27, 39, 51, 0.04), 0px 4px 8px rgba(27, 39, 51, 0.04)"
      borderBottom="1px solid"
      borderColor="var(--colors-border)"
      bg="var(--colors-bg)"
      position="fixed"
      width="100%"
    >
      <Link href="/" passHref>
        <a aria-label="Homepage" title="Stacks Explorer Homepage">
          <BlockstackLogo m="base-loose" />
        </a>
      </Link>
      <SearchBarWithDropdown height="40px" maxWidth="544px" onChange={updateQuery} />
    </Flex>
  );
};

export const PageWrapper: React.FC<BoxProps> = props => {
  return (
    <>
      <Header />
      <Page pt="extra-loose" mt="64px" {...props} />
    </>
  );
};
