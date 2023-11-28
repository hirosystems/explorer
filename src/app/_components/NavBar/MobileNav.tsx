import { useColorMode } from '@chakra-ui/react';
import React, { FC } from 'react';
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
      display={{ md: 'none' }}
      position="fixed"
      top={0}
      left={0}
      height="100vh"
      width="100vw"
      zIndex={2}
      backgroundColor={`bg.${colorMode}`}
      padding={'0 32px'}
    >
      <Flex justifyContent={'space-between'} padding={'16px 0'} height={'64px'} mb={'10px'}>
        <ColorModeButton
          aria-label={'Change color mode'}
          color={`invert.${colorMode}`}
          borderWidth={'1px'}
        />
        <IconButton
          onClick={close}
          size="40px"
          color={`invert.${colorMode}`}
          icon={<TbX size={'32px'} />}
          aria-label={'Close menu'}
        />
      </Flex>
      <Flex direction={'column'} gap={'16px'}>
        {navItems.map(navItem => (
          <MobileNavItem key={navItem.id} {...navItem} />
        ))}
      </Flex>
    </Stack>
  );
};
