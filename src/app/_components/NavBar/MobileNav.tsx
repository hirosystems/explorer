import { Flex, Icon, Separator, Stack } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { useEffect } from 'react';

import { TokenPrice } from '../../../common/types/tokenPrice';
import { IconButton } from '../../../ui/IconButton';
import { BtcStxPrice } from './BtcStxPrice';
import { LabelWrapper } from './LabelWrapper';
import { Logo } from './Logo';
import { MobileColorModeButton } from './MobileColorModeButton';
import { NavLabel } from './NavLabel';
import { NavItem } from './types';

export function MobileNav({
  tokenPrice,
  navItems,
  close,
}: {
  tokenPrice: TokenPrice;
  navItems: NavItem[];
  close: () => void;
}) {
  const handleScroll = (event: Event) => {
    event.preventDefault();
  };

  const exploreNavItems = navItems.find(navItem => navItem.id === 'explore')?.children;
  const sandboxNavItem = navItems.find(navItem => navItem.id === 'sandbox');
  sandboxNavItem && (sandboxNavItem.label = <NavLabel>Sandbox</NavLabel>);
  const nonNetworkNavItems = exploreNavItems?.concat(sandboxNavItem ?? []);
  const networkNavItems = navItems.find(navItem => navItem.id === 'network')?.children;

  // Disable scrolling when the menu is open
  useEffect(() => {
    if (document.body) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('scroll', handleScroll, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <Stack
      position="fixed"
      height="full"
      width="full"
      backgroundColor="surface"
      top={0}
      left={0}
      zIndex={'overlay'}
      padding={6}
      gap={3}
      overflow="scroll"
    >
      <Flex justifyContent={'space-between'} alignItems={'center'} height={10}>
        <Logo color="surfaceOpposite" />
        <IconButton onClick={close} aria-label={'Close menu'}>
          <Icon h={6} w={6} color="surfaceOpposite">
            <X />
          </Icon>
        </IconButton>
      </Flex>
      <Flex justifyContent={'space-between'}>
        <Flex gap={3}>
          <MobileColorModeButton
            colorMode="light"
            aria-label={'Change color mode'}
            color="invert"
            borderWidth={'1px'}
            borderRadius="xl"
          />
          <MobileColorModeButton
            colorMode="dark"
            aria-label={'Change color mode'}
            color="invert"
            borderWidth={'1px'}
            borderRadius="xl"
          />
        </Flex>
        <BtcStxPrice tokenPrice={tokenPrice} />
      </Flex>
      <Stack separator={<Separator borderColor="border" />}>
        {nonNetworkNavItems?.map((navItem, i) => (
          <>
            <LabelWrapper {...navItem} />
            {i === nonNetworkNavItems.length - 1 && <Separator borderColor="border" />}
          </>
        ))}
      </Stack>
      <Stack gap={3}>{networkNavItems?.map(navItem => <LabelWrapper {...navItem} />)}</Stack>
    </Stack>
  );
}
