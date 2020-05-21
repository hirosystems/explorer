import React from 'react';
import Link from 'next/link';
import { Box, BoxProps, Flex, FlexProps, BlockstackIcon } from '@blockstack/ui';

import { TestnetSelector } from '@components/testnet-selector';
import { SearchBarWithDropdown } from '@components/search-bar';

export const LogoNavItem = (props: BoxProps) => (
  <Box flexShrink={0} {...props}>
    <Link href="/" passHref>
      <a aria-label="Homepage" title="Stacks Explorer">
        <BlockstackIcon color="var(--colors-invert)" size="24px" />
      </a>
    </Link>
  </Box>
);

const HeaderBar = (props: FlexProps) => (
  <Box position="fixed" zIndex={99999} top={0} width="100%">
    <Flex
      zIndex={9999}
      height="64px"
      alignItems="center"
      flexDirection="row"
      bg="var(--colors-bg)"
      borderBottom="1px solid"
      borderColor="var(--colors-border)"
      boxShadow="0px 1px 2px rgba(27, 39, 51, 0.04), 0px 4px 8px rgba(27, 39, 51, 0.04)"
      px={['base', 'base', 'extra-loose']}
      position="relative"
      {...props}
    />
  </Box>
);

export const Header = ({ isHome, ...props }: { isHome?: boolean } & FlexProps) => (
  <HeaderBar justifyContent={isHome ? 'space-between' : 'unset'} {...props}>
    <LogoNavItem mr="base" />
    <Flex
      mx={['none', 'none', 'auto']}
      width="100%"
      justifyContent={isHome ? 'space-between' : 'unset'}
      pl={['unset', 'unset', 'base-loose']}
      pr={!isHome ? ['unset', 'unset', '52px'] : 'unset'}
      maxWidth={isHome ? 'unset' : '1280px'}
      align="center"
    >
      {!isHome ? (
        <SearchBarWithDropdown
          boxProps={{
            transform: ['none', 'none', 'translateX(-11px)'],
          }}
          small
          height="40px"
          maxWidth={['100%', '100%', '544px']}
        />
      ) : null}
      <TestnetSelector display={['none', 'none', 'block']} ml="auto" pl="base" />
    </Flex>
  </HeaderBar>
);
