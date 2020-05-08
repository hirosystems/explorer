import React from 'react';
import Link from 'next/link';
import { Box, BoxProps, Flex, FlexProps, BlockstackIcon } from '@blockstack/ui';

import { Text } from '@components/typography';
import { SearchBarWithDropdown } from '@components/search-bar';

export const LogoNavItem = (props: BoxProps) => (
  <Box mr="base" {...props}>
    <Link href="/" passHref>
      <a aria-label="Homepage" title="Stacks Explorer">
        <BlockstackIcon color="var(--colors-invert)" size="24px" />
      </a>
    </Link>
  </Box>
);

const HeaderBar = (props: FlexProps) => (
  <Flex
    top={0}
    width="100%"
    zIndex={9999}
    height="64px"
    position="fixed"
    alignItems="center"
    flexDirection="row"
    bg="var(--colors-bg)"
    borderBottom="1px solid"
    borderColor="var(--colors-border)"
    boxShadow="0px 1px 2px rgba(27, 39, 51, 0.04), 0px 4px 8px rgba(27, 39, 51, 0.04)"
    px={['base', 'base', 'extra-loose']}
    {...props}
  />
);

export const Header = ({ isHome, ...props }: { isHome?: boolean } & FlexProps) => (
  <HeaderBar justifyContent={isHome ? 'space-between' : 'unset'} {...props}>
    <LogoNavItem />
    <Flex
      mx="auto"
      width="100%"
      justifyContent={isHome ? 'space-between' : 'unset'}
      maxWidth={isHome ? 'unset' : '1280px'}
    >
      {!isHome ? (
        <SearchBarWithDropdown small height="40px" maxWidth={['100%', '100%', '544px']} />
      ) : (
        <Box ml="auto">
          <Text>Testnet</Text>
        </Box>
      )}
    </Flex>
  </HeaderBar>
);
