'use client';

import { useMemo } from 'react';
import { PiList } from 'react-icons/pi';

import { useGlobalContext } from '../../../common/context/useAppContext';
import { TokenPrice } from '../../../common/types/tokenPrice';
import { buildUrl } from '../../../common/utils/buildUrl';
import { capitalize } from '../../../common/utils/utils';
import { Search } from '../../../features/search/Search';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
import { Show } from '../../../ui/Show';
import { useDisclosure } from '../../../ui/hooks/useDisclosure';
import { BtcStxPrice } from './BtcStxPrice';
import { ColorModeButton } from './ColorModeButton';
import { DesktopNav } from './DesktopNav';
import { ExploreItems } from './ExploreItems';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { NetworkItems } from './NetworkItems';
import { NetworkModeBanner } from './NetworkModeBanner';
import { NavItem } from './types';

export function NavBar({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const { isOpen, onToggle } = useDisclosure();
  const { activeNetwork } = useGlobalContext();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: 'explore',
        label: 'Explore',
        children: <ExploreItems />,
      },
      {
        id: 'sandbox',
        label: 'Sandbox',
        href: buildUrl('/sandbox/deploy', activeNetwork),
      },
      {
        id: 'network',
        label: capitalize(activeNetwork.mode ?? 'Custom network'),
        children: <NetworkItems />,
      },
    ],
    [activeNetwork]
  );

  return (
    <Box width="full">
      <Flex alignItems={'center'} flex={{ base: 1 }} gap={6} position={'relative'}>
        <Logo />
        <Search />
        <Show above="lg">
          <NetworkModeBanner />
        </Show>
        <Show above="lg">
          <Flex gap={3}>
            <ColorModeButton aria-label={'Change color mode'} />
            <DesktopNav navItems={navItems} />
          </Flex>
          <BtcStxPrice tokenPrice={tokenPrice} />
        </Show>
        <Show below="lg">
          <IconButton
            onClick={onToggle}
            icon={<Icon as={PiList} w={6} h={6} color={'white'} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
          {isOpen && <MobileNav navItems={navItems} close={onToggle} />}
        </Show>
      </Flex>
    </Box>
  );
}
