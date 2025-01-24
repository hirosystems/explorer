'use client';

import { Flex, Icon, useDisclosure } from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { openModal } from '../../../common/components/modals/modal-slice';
import { MODALS } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { useAppDispatch } from '../../../common/state/hooks';
import { Network } from '../../../common/types/network';
import { TokenPrice } from '../../../common/types/tokenPrice';
import { buildUrl } from '../../../common/utils/buildUrl';
import { capitalize } from '../../../common/utils/utils';
import { FeePopover } from './FeePopover';
import { Logo } from './Logo';
import { NavLabel } from './NavLabel';
import { NetworkLabel } from './NetworkLabel';
import PagesSlidingMenu from './PagesSlidingMenu';
import { SettingsPopover } from './SettingsPopover';
import { NavItem } from './types';

export function NavBar({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const { open, onToggle } = useDisclosure();
  const { networks, activeNetwork } = useGlobalContext();
  const dispatch = useAppDispatch();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: 'explore',
        label: 'Explore',
        children: [
          {
            id: 'blocks',
            label: <NavLabel>Blocks</NavLabel>,
            href: buildUrl('/blocks', activeNetwork),
          },
          {
            id: 'tokens',
            label: <NavLabel>Tokens</NavLabel>,
            href: buildUrl('/tokens', activeNetwork),
          },
          {
            id: 'transactions',
            label: <NavLabel>Transactions</NavLabel>,
            href: buildUrl('/transactions', activeNetwork),
          },
          {
            id: 'signers',
            label: <NavLabel>Signers</NavLabel>,
            href: buildUrl('/signers', activeNetwork),
          },
        ],
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
            label: (
              <NavLabel
                icon={
                  <Icon h={4} w={4} color={'text'}>
                    <Plus />
                  </Icon>
                }
              >
                Add a network
              </NavLabel>
            ),
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
    <Flex
      width="full"
      h={20}
      alignItems="center"
      border="1px solid"
      borderColor="surface"
      justifyContent="space-between"
    >
      <Flex alignItems="center" gap={6}>
        <Logo size={10} />
        <PagesSlidingMenu width={50} />
      </Flex>
      <Flex gap={4}>
        <FeePopover />
        <SettingsPopover />
      </Flex>
      {/* <Search /> */}
      {/* <Flex hideBelow="lg">
          <NetworkModeBanner />
        </Flex>
        <Flex hideBelow="lg" gap={3} alignItems="center">
          <DesktopColorModeButton aria-label={'Change color mode'} />
          <DesktopNav navItems={navItems} />
        </Flex> */}
      {/* <Box hideBelow="lg">
          <BtcStxPrice tokenPrice={tokenPrice} />
        </Box> */}
      {/* <Flex hideFrom="lg">
          <IconButton onClick={onToggle} variant={'ghost'} aria-label={'Toggle Navigation'}>
            <Icon w={6} h={6} color={'white'}>
              <List />
            </Icon>
          </IconButton>
          {open && <MobileNav tokenPrice={tokenPrice} navItems={navItems} close={onToggle} />}
        </Flex> */}
    </Flex>
  );
}
