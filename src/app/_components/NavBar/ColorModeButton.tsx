'use client';

import { ColorMode, useColorMode } from '@chakra-ui/react';
import { PiMoon, PiSunDim } from 'react-icons/pi';

import { IconButton, IconButtonProps } from '../../../ui/IconButton';

export function ColorModeButton({
  colorModeOverride,
  ...rest
}: {
  colorModeOverride?: ColorMode;
} & IconButtonProps) {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const Icon = colorModeOverride
    ? colorModeOverride === 'light'
      ? PiSunDim
      : PiMoon
    : colorMode === 'light'
      ? PiSunDim
      : PiMoon;
  const onClick = () => {
    if (colorModeOverride) {
      setColorMode(colorModeOverride === 'light' ? 'light' : 'dark');
    } else {
      toggleColorMode();
    }
  };
  return (
    <IconButton
      icon={<Icon />}
      onClick={onClick}
      color="white"
      title="Toggle color mode"
      _hover={{
        bg: 'dropdownBgHover',
      }}
      {...rest}
    />
  );
}
