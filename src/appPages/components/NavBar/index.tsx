import { RxHamburgerMenu } from 'react-icons/rx';
import { ReactNode, useMemo } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { Box, Flex, Icon, IconButton } from '@/ui/components';

import { useDisclosure } from '@/ui/hooks/useDisclosure';
import { Logo } from './Logo';
import { SearchComponent } from '@/features/search/search';
import { DesktopNav } from '@/appPages/components/NavBar/DesktopNav';
import { NavItem } from '@/appPages/components/NavBar/types';
import { buildUrl } from '@/appPages/common/utils/buildUrl';
import { useGlobalContext } from '@/common/context/useAppContext';
import { NetworkModeBanner } from '@/components/network-mode-banner';
import { BtcStxPrice } from '@/components/btc-stx-price';
import { MODALS, PAGE_MAX_WIDTH } from '@/common/constants';
import { ColorModeButton } from '@/components/color-mode-button';
import { openModal } from '@/components/modals/modal-slice';
import { useAppDispatch } from '@/common/state/hooks';
import { Network } from '@/common/types/network';
import { NetworkLabel } from '@/appPages/components/NavBar/NetworkLabel';
import { NavLabel } from '@/appPages/components/NavBar/NavLabel';
import { MobileNav } from '@/appPages/components/NavBar/MobileNav';

export function NavBar(props: { children?: ReactNode }) {
  const { isOpen, onToggle } = useDisclosure();
  const {
    networks,
    activeNetwork,
    apiUrls: { mainnet, testnet },
  } = useGlobalContext();
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();

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
      margin="auto"
      padding={{ base: '0 16px', md: '0 32px' }}
    >
      <Flex align="center" justifyContent="space-between">
        <Flex
          flex={{ base: 1 }}
          alignItems="center"
          height="64px"
          gap="16px"
          justifyContent="space-between"
        >
          <Logo />
          <SearchComponent
            display={['none', 'none', 'block', 'block']}
            variant="small"
            width="100%"
            maxWidth="760px"
          />
          <NetworkModeBanner />
          <Flex display={{ base: 'none', md: 'flex' }} gap="16px">
            <ColorModeButton aria-label="Change color mode" />
            <DesktopNav navItems={navItems} />
            <BtcStxPrice />
          </Flex>
        </Flex>

        <Flex display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={<Icon as={RxHamburgerMenu} w={5} h={5} color="#fff" />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
      </Flex>
      {isOpen && <MobileNav navItems={navItems} close={onToggle} />}
    </Box>
  );
}
