'use client';

import { FC, useMemo } from 'react';
import { PiList } from 'react-icons/pi';

import { openModal } from '../../../common/components/modals/modal-slice';
import { MODALS } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useAppDispatch } from '../../../common/state/hooks';
import { Network } from '../../../common/types/network';
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
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { NavLabel } from './NavLabel';
import { NetworkLabel } from './NetworkLabel';
import { NetworkModeBanner } from './NetworkModeBanner';
import { NavItem } from './types';

export function NavBar({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const { isOpen, onToggle } = useDisclosure();
  const { networks, activeNetwork } = useGlobalContext();
  const dispatch = useAppDispatch();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: 'blockchain',
        label: 'Blockchain',
        children: [
          {
            id: 'transactions',
            label: <NavLabel>Transactions</NavLabel>,
            href: buildUrl('/transactions', activeNetwork),
          },
          {
            id: 'blocks',
            label: <NavLabel>Blocks</NavLabel>,
            href: buildUrl('/blocks', activeNetwork),
          },
        ],
      },
      {
        id: 'tokens',
        label: 'Tokens',
        href: buildUrl('/tokens', activeNetwork),
      },
      {
        id: 'sandbox',
        label: 'Sandbox',
        href: buildUrl('/sandbox/deploy', activeNetwork),
      },
      {
        id: 'network',
        label: capitalize(activeNetwork.mode ?? 'Custom network'),
        children: [
          ...Object.values<Network>(networks).map((network, key) => {
            return {
              id: network.url,
              label: <NetworkLabel network={network} key={key} />,
            };
          }),
          {
            id: 'add-network',
            label: <NavLabel>Add a network</NavLabel>,
            onClick: () => {
              dispatch(openModal(MODALS.ADD_NETWORK));
            },
          },
        ],
      },
    ],
    [activeNetwork, networks, dispatch]
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
