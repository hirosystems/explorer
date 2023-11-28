'use client';

import { FC, useMemo } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

import { openModal } from '../../../common/components/modals/modal-slice';
import { MODALS, PAGE_MAX_WIDTH } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useAppDispatch } from '../../../common/state/hooks';
import { Network } from '../../../common/types/network';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Search } from '../../../features/search/Search';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
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

export const NavBar: FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const {
    networks,
    activeNetwork,
    apiUrls: { mainnet, testnet },
  } = useGlobalContext();
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
        label: 'Network',
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
    <Box
      width="100%"
      maxWidth={PAGE_MAX_WIDTH}
      margin={'auto'}
      padding={{ base: '0 16px', md: '0 32px' }}
    >
      <Flex align={'center'} justifyContent={'space-between'}>
        <Flex
          flex={{ base: 1 }}
          alignItems={'center'}
          height={'64px'}
          gap={'16px'}
          justifyContent={'space-between'}
        >
          <Logo />
          <Search
            display={['none', 'none', 'block', 'block']}
            variant="small"
            width="100%"
            maxWidth="760px"
          />
          <NetworkModeBanner />
          <Flex display={{ base: 'none', md: 'flex' }} gap={'16px'}>
            <ColorModeButton aria-label={'Change color mode'} />
            <DesktopNav navItems={navItems} />
            <BtcStxPrice />
          </Flex>
        </Flex>

        <Flex display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={<Icon as={RxHamburgerMenu} w={5} h={5} color={'#fff'} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
      </Flex>
      {isOpen && <MobileNav navItems={navItems} close={onToggle} />}
    </Box>
  );
};
