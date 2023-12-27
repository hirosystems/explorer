import { useColorMode } from '@chakra-ui/react';
import React, { FC } from 'react';
import { PiX } from 'react-icons/pi';
import { TbX } from 'react-icons/tb';

import { Flex } from '../../../ui/Flex';
import { IconButton } from '../../../ui/IconButton';
import { Stack } from '../../../ui/Stack';
import { ColorModeButton } from './ColorModeButton';
import { MobileNavItem } from './MobileNavItem';
import { NavItem } from './types';

export const MobileNav: FC<{ navItems: NavItem[]; close: () => void }> = ({ navItems, close }) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Stack
      position="fixed"
      height="full"
      width="full"
      backgroundColor="bg"
      top={0}
      left={0}
      zIndex={2}
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
