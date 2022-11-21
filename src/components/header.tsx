import { Box, BoxProps, Flex, FlexProps, IconButton } from '@stacks/ui';
import dynamic from 'next/dynamic';
import React from 'react';
import { StxInline } from '@components/icons/stx-inline';
import { HeaderTextItem } from '@components/header-text-item';
import { NetworkSwitcherItem } from '@components/network-switcher';
import { MobileMenu } from '@components/mobile-menu';
import { ExplorerLink } from '@components/links';
import { StatusBar } from '@features/status-bar/status-bar';
import { BtcStxPrice } from '@components/btc-stx-price';
import { SearchComponent } from '@features/search/search';
import { NetworkModeBanner } from '@components/network-mode-banner';

const ColorModeButton = dynamic(() => import('@components/color-mode-button'), { ssr: false });

export const LogoNavItem = React.memo((props: BoxProps) => {
  return (
    <Box {...props}>
      <ExplorerLink path={'/'}>
        <a>
          <IconButton
            invert
            size="42px"
            iconSize="24px"
            icon={StxInline}
            color="white"
            flexShrink={0}
            aria-label="Homepage"
            title="Stacks Explorer"
            as="span"
          />
        </a>
      </ExplorerLink>
    </Box>
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
    position="relative"
    zIndex={99999}
    {...props}
  />
));

const Navigation: React.FC = () => {
  return (
    <>
      <Flex alignItems="center" display={['none', 'none', 'none', 'flex']} gap={'16px'}>
        <ColorModeButton mr="-8px" />
        <ExplorerLink path={'/transactions'}>
          <HeaderTextItem>Transactions</HeaderTextItem>
        </ExplorerLink>
        <ExplorerLink path={'/blocks'}>
          <HeaderTextItem>Blocks</HeaderTextItem>
        </ExplorerLink>
        <ExplorerLink path={'/sandbox/deploy'}>
          <HeaderTextItem>Sandbox</HeaderTextItem>
        </ExplorerLink>
        <NetworkSwitcherItem />
        <BtcStxPrice />
      </Flex>
      <MobileMenu />
    </>
  );
};

export const Header: React.FC<
  { isHome?: boolean; fullWidth?: boolean; networkMode?: string } & FlexProps
> = React.memo(({ isHome, fullWidth, networkMode, ...props }) => {
  return (
    <>
      <StatusBar />
      <HeaderBar
        mx="auto"
        width="100%"
        maxWidth={isHome || fullWidth ? '100%' : '1280px'}
        justifyContent={isHome || fullWidth ? 'space-between' : 'unset'}
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
          <Flex alignItems="center" flexGrow={1}>
            <SearchComponent
              display={['none', 'none', 'block', 'block']}
              variant="small"
              mr="base"
              width="100%"
              maxWidth="760px"
            />
            <NetworkModeBanner order={[-1, -1, 2, 2]} mr="tight" />
          </Flex>
          <Navigation />
        </Flex>
      </HeaderBar>
    </>
  );
});
