import { Divider } from '@chakra-ui/react';
import { useEffect } from 'react';
import { PiX } from 'react-icons/pi';

import { useAppSelector } from '../../../common/state/hooks';
import { TokenPrice } from '../../../common/types/tokenPrice';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
import { Stack } from '../../../ui/Stack';
import { selectIsStatusBarActive } from '../StatusBar/status-bar-slice';
import { BtcStxPrice } from './BtcStxPrice';
import { ColorModeButton } from './ColorModeButton';
import { LabelWrapper } from './LabelWrapper';
import { Logo } from './Logo';
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
  const isStatusBarActive = useAppSelector(selectIsStatusBarActive);

  const handleScroll = (event: Event) => {
    event.preventDefault();
  };

  const explorerNavItems = navItems.find(navItem => navItem.id === 'explore')?.children;
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
      top={isStatusBarActive ? '82px' : 0}
      left={0}
      zIndex={'overlay'}
      padding={6}
      gap={3}
    >
      <Flex justifyContent={'space-between'} alignItems={'center'} height={10}>
        <Logo />
        <IconButton onClick={close} icon={<Icon as={PiX} size={6} />} aria-label={'Close menu'} />
      </Flex>
      <Flex justifyContent={'space-between'}>
        <Flex gap={3}>
          <ColorModeButton
            aria-label={'Change color mode'}
            color="invert"
            borderWidth={'1px'}
            colorModeOverride="light"
            borderRadius="xl"
          />
          <ColorModeButton
            aria-label={'Change color mode'}
            color="invert"
            borderWidth={'1px'}
            colorModeOverride="dark"
            borderRadius="xl"
          />
        </Flex>
        <BtcStxPrice tokenPrice={tokenPrice} />
      </Flex>
      <Stack divider={<Divider borderColor="border" />}>
        {explorerNavItems?.map((navItem, i) => (
          <>
            <LabelWrapper {...navItem} />
            {i === explorerNavItems.length - 1 && <Divider borderColor="border" />}
          </>
        ))}
      </Stack>
      <Stack spacing={3}>{networkNavItems?.map(navItem => <LabelWrapper {...navItem} />)}</Stack>
    </Stack>
  );
}
