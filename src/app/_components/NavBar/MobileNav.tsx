<<<<<<< HEAD
import { FC, useEffect } from 'react';
=======
import React, { FC } from 'react';
>>>>>>> e74175d (feat: grouped by btc block list view)
import { PiX } from 'react-icons/pi';

import { useAppSelector } from '../../../common/state/hooks';
import { Flex } from '../../../ui/Flex';
import { IconButton } from '../../../ui/IconButton';
import { Stack } from '../../../ui/Stack';
import { selectIsStatusBarActive } from '../StatusBar/status-bar-slice';
import { ColorModeButton } from './ColorModeButton';
import { MobileNavItem } from './MobileNavItem';
import { NavItem } from './types';

export const MobileNav: FC<{ navItems: NavItem[]; close: () => void }> = ({ navItems, close }) => {
  const isStatusBarActive = useAppSelector(selectIsStatusBarActive);

  const handleScroll = (event: Event) => {
    event.preventDefault();
  };

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
      backgroundColor="bg"
      top={isStatusBarActive ? '82px' : 0}
      left={0}
      zIndex={'sticky'}
      padding={6}
      gap={6}
    >
      <Flex justifyContent={'space-between'}>
        <ColorModeButton aria-label={'Change color mode'} color="invert" borderWidth={'1px'} />
        <IconButton onClick={close} icon={<PiX />} aria-label={'Close menu'} />
      </Flex>
      {navItems.map(navItem => (
        <MobileNavItem key={navItem.id} {...navItem} />
      ))}
    </Stack>
  );
};
