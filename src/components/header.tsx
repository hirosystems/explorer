import React, { useState } from 'react';
import Link from 'next/link';
import { Box, BoxProps, Flex, FlexProps } from '@blockstack/ui';

import { BlockstackLogo } from '@components/icons/blockstack-logo';
import { search } from '@common/search';
import { SearchBarWithDropdown } from '@components/search-bar';

export const LogoNavItem = (props: BoxProps) => (
  <Box {...props}>
    <Link href="/" passHref>
      <a aria-label="Homepage" title="Stacks Explorer">
        <BlockstackLogo m="base-loose" />
      </a>
    </Link>
  </Box>
);

const HeaderForm = (props: FlexProps) => (
  <Flex
    top={0}
    as="form"
    width="100%"
    height="64px"
    position="fixed"
    alignItems="center"
    flexDirection="row"
    bg="var(--colors-bg)"
    borderBottom="1px solid"
    borderColor="var(--colors-border)"
    boxShadow="0px 1px 2px rgba(27, 39, 51, 0.04), 0px 4px 8px rgba(27, 39, 51, 0.04)"
    {...props}
  />
);

export const Header = (props: FlexProps) => {
  const [query, setQuery] = useState('');

  const handleQueryUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const updateQuery = React.useCallback(handleQueryUpdate, []);

  return (
    <HeaderForm onSubmit={search(query)} {...props}>
      <LogoNavItem />
      <SearchBarWithDropdown height="40px" maxWidth="544px" onChange={updateQuery} />
    </HeaderForm>
  );
};
