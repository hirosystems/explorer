'use client';

import { Moon, SunDim } from '@phosphor-icons/react';
import { useCallback } from 'react';

import { useColorMode } from '../../../components/ui/color-mode';
import { IconButton, IconButtonProps } from '../../../ui/IconButton';

export function ColorModeButton2({
  colorMode,
  ...rest
}: {
  colorMode: 'light' | 'dark';
} & IconButtonProps) {
  const { setColorMode } = useColorMode();

  const onClick = useCallback(() => {
    setColorMode(colorMode);
  }, [setColorMode, colorMode]);

  return (
    <IconButton
      onClick={onClick}
      title={`Change the color mode to ${colorMode}`}
      color="white"
      _hover={{
        bg: 'hoverBackground',
        color: 'text',
      }}
      {...rest}
    >
      {colorMode === 'light' ? <SunDim /> : <Moon />}
    </IconButton>
  );
}
