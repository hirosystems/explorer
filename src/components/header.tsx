import { BtcStxPrice } from '@/components/btc-stx-price';
import { ColorModeButton } from '@/components/color-mode-button';
import { HeaderTextItem } from '@/components/header-text-item';
import { ExplorerLink } from '@/components/links';
import { MobileMenu } from '@/components/mobile-menu';
import { NetworkModeBanner } from '@/components/network-mode-banner';
import { NetworkSwitcherItem } from '@/components/network-switcher';
import { SearchComponent } from '@/features/search/search';
import { Indicator, StatusBar, StatusBarBase } from '@/features/status-bar/status-bar';
import { Box, BoxProps, Flex, FlexProps, IconButton, TextLink } from '@/ui/components';
import { StxIcon } from '@/ui/icons/StxIcon';
import { Text } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useGlobalContext } from '@/common/context/useAppContext';

export const LogoNavItem = React.memo((props: BoxProps) => {
  return (
    <Box {...props}>
      <ExplorerLink href={'/'}>
        <a>
          <IconButton
            size="42px"
            icon={<StxIcon strokeWidth={1.5} size="24px" color="white" />}
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
    px={['16px', '16px', '32px']}
    width="100%"
    position="relative"
    zIndex={1000}
    {...props}
  />
));

const Navigation: React.FC = () => {
  const { activeNetwork } = useGlobalContext();
  return (
    <>
      <Flex alignItems="center" display={['none', 'none', 'none', 'flex']} gap={'16px'}>
        <ColorModeButton aria-label={'Change color mode'} mr="-8px" />
        <ExplorerLink href={'/transactions'}>
          <HeaderTextItem>Transactions</HeaderTextItem>
        </ExplorerLink>
        <ExplorerLink href={'/blocks'}>
          <HeaderTextItem>Blocks</HeaderTextItem>
        </ExplorerLink>
        {!activeNetwork.isSubnet && (
          <ExplorerLink href={'/sandbox/deploy'}>
            <HeaderTextItem>Sandbox</HeaderTextItem>
          </ExplorerLink>
        )}
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
        pl={['unset', 'unset', '20px']}
        maxWidth={isHome || fullWidth ? 'unset' : '1280px'}
        alignItems="center"
      >
        <Flex alignItems="center" flexGrow={1} gap={'8px'}>
          <SearchComponent
            display={['none', 'none', 'block', 'block']}
            variant="small"
            mr="16px"
            width="100%"
            maxWidth="760px"
          />
          <NetworkModeBanner />
        </Flex>
        <Navigation />
      </Flex>
    </HeaderBar>
  );
});
