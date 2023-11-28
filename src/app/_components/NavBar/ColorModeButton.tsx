'use client';

import { useColorMode } from '@chakra-ui/react';
import { FC } from 'react';
import { TbSun, TbSunOff } from 'react-icons/tb';

import { IconButton, IconButtonProps } from '../../../ui/IconButton';

export const ColorModeButton: FC<IconButtonProps> = props => {
  const { colorMode, toggleColorMode } = useColorMode();
  const Icon = colorMode === 'light' ? TbSun : TbSunOff;
  return (
    <IconButton
      icon={<Icon />}
      onClick={toggleColorMode}
      color="white"
      title="Toggle color mode"
      {...props}
    />
  );
};
