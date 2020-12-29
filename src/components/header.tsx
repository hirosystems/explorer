import { Box, BoxProps, Flex, FlexProps, Grid, transition } from '@stacks/ui';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import React from 'react';
import { SearchBarWithDropdown } from '@components/search-bar';
import { StxInline } from '@components/icons/stx-inline';
import { HeaderTextItem } from '@components/header-text-item';
import { NetworkSwitcherItem } from '@components/network-switcher';
import { SearchComponent } from '@components/search/search';

const ColorModeButton = dynamic(() => import('@components/color-mode-button'), { ssr: false });

export const LogoNavItem = React.memo((props: BoxProps) => {
  return (
    <NextLink href="/" passHref>
      <Grid
        placeItems="center"
        size="37px"
        color="white"
        borderRadius="37px"
        flexShrink={0}
        _hover={{ bg: '#5546FF', color: 'white' }}
        aria-label="Homepage"
        title="Stacks Explorer"
        as="a"
        transition={transition}
        {...props}
      >
        <StxInline color="currentColor" size="22px" />
      </Grid>
    </NextLink>
  );
});

const HeaderBar: React.FC<FlexProps> = React.memo(props => (
  <Flex
    top={0}
    height="64px"
    alignItems="center"
    flexDirection="row"
    px={['base', 'base', 'extra-loose']}
    width="100%"
    {...props}
    position="relative"
    zIndex={9999999}
  />
));

export const Header: React.FC<{ isHome?: boolean; fullWidth?: boolean } & FlexProps> = React.memo(
  ({ isHome, fullWidth, ...props }) => (
    <HeaderBar
      mx="auto"
      width="100%"
      maxWidth={isHome ? '100%' : '1280px'}
      justifyContent={isHome ? 'space-between' : 'unset'}
      {...props}
    >
      <LogoNavItem />
      <Flex
        mx={['none', 'none', 'auto']}
        width="100%"
        justifyContent={isHome || fullWidth ? 'space-between' : 'unset'}
        pl={['unset', 'unset', 'base-loose']}
        maxWidth={isHome || fullWidth ? 'unset' : '1280px'}
        alignItems="center"
      >
        <Box flexGrow={1} pr="64px">
          {!isHome ? <SearchComponent variant="small" /> : null}
        </Box>
        <Box ml="auto" pl="base" />
        <ColorModeButton mr="tight" />
        <NextLink href="/transactions" passHref>
          <HeaderTextItem mr="base">Transactions</HeaderTextItem>
        </NextLink>
        <NextLink href="/blocks" passHref>
          <HeaderTextItem mr="base">Blocks</HeaderTextItem>
        </NextLink>
        <NextLink href="/sandbox" passHref>
          <HeaderTextItem>Sandbox</HeaderTextItem>
        </NextLink>
        <NetworkSwitcherItem ml="base" />
      </Flex>
    </HeaderBar>
  )
);
