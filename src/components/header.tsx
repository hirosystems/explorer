import { Box, BoxProps, Flex, FlexProps, IconButton, Fade, color } from '@stacks/ui';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import React from 'react';
import { StxInline } from '@components/icons/stx-inline';
import { HeaderTextItem } from '@components/header-text-item';
import { NetworkSwitcherItem } from '@components/network-switcher';
import { SearchComponent } from '@components/search/search';
import { MobileMenu } from '@components/mobile-menu';
import { useModal } from '@common/hooks/use-modal';
import { IconSearch } from '@tabler/icons';

const ColorModeButton = dynamic(() => import('@components/color-mode-button'), { ssr: false });

export const LogoNavItem = React.memo((props: BoxProps) => {
  return (
    <Box {...props}>
      <NextLink href="/" passHref>
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
      </NextLink>
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
    zIndex={9999999}
    {...props}
  />
));

const Navigation: React.FC = () => {
  return (
    <>
      <Flex alignItems="center" display={['none', 'none', 'none', 'flex']}>
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
      <MobileMenu />
    </>
  );
};

export const Header: React.FC<
  { isHome?: boolean; fullWidth?: boolean; networkMode?: string } & FlexProps
> = React.memo(({ isHome, fullWidth, networkMode, ...props }) => {
  const { handleOpenSearchModal } = useModal();
  return (
    <>
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
          <Box flexGrow={1}>
            {!isHome ? (
              <>
                <SearchComponent
                  display={['none', 'none', 'block', 'block']}
                  variant="small"
                  mr="base"
                />
                <IconButton
                  display={['flex', 'flex', 'none', 'none']}
                  ml="auto"
                  invert
                  color="white"
                  icon={IconSearch}
                  onClick={handleOpenSearchModal}
                />
              </>
            ) : null}
          </Box>
          <Navigation />
        </Flex>
      </HeaderBar>
    </>
  );
});
