import {
  BlockstackIcon,
  Box,
  BoxProps,
  color,
  Flex,
  FlexProps,
  Grid,
  transition,
} from '@stacks/ui';

import { ColorModeButton } from '@components/color-mode-button';
import { Link } from '@components/typography';
import NextLink from 'next/link';
import React from 'react';
import { SearchBarWithDropdown } from '@components/search-bar';
import { StacksLogo } from '@components/icons/stx-logo';
import { StxNexus } from '@components/icons/stx-nexus';
import { TestnetSelector } from '@components/testnet-selector';

type HeaderTextItemProps = BoxProps & Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

export const HeaderTextItem = React.forwardRef((props: HeaderTextItemProps, ref) => (
  <Link as="a" fontSize="14px" fontWeight={500} color="white" ref={ref as any} {...props} />
));

export const LogoNavItem = React.memo((props: BoxProps) => (
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
      <StxNexus color="currentColor" size="21px" />
    </Grid>
  </NextLink>
));

const HeaderBar: React.FC<FlexProps> = React.memo(props => (
  <Flex
    top={0}
    zIndex={9999}
    height="64px"
    alignItems="center"
    flexDirection="row"
    px={['base', 'base', 'extra-loose']}
    width="100%"
    {...props}
    position="relative"
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
        <Box ml="auto" pl="base" />
        <ColorModeButton mr="tight" />
        <NextLink href="/transactions" passHref>
          <HeaderTextItem mr="base">Transactions</HeaderTextItem>
        </NextLink>
        <NextLink href="/sandbox" passHref>
          <HeaderTextItem>Sandbox</HeaderTextItem>
        </NextLink>
        <TestnetSelector display={['none', 'none', 'block']} pl="base" />
      </Flex>
    </HeaderBar>
  )
);
