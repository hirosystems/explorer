'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { Moon, SunDim } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';

import { IconButton, IconButtonProps } from '../../../ui/IconButton';

export function ColorModeButton({
  colorModeOverride,
  ...rest
}: {
  colorModeOverride?: 'light' | 'dark';
} & IconButtonProps) {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const Icon = useMemo(
    () =>
      colorModeOverride
        ? colorModeOverride === 'light'
          ? SunDim
          : Moon
        : colorMode === 'light'
          ? SunDim
          : Moon,
    [colorMode, colorModeOverride]
  );
  const onClick = useCallback(() => {
    if (colorModeOverride) {
      setColorMode(colorModeOverride === 'light' ? 'light' : 'dark');
    } else {
      toggleColorMode();
    }
  }, [colorModeOverride, setColorMode, toggleColorMode]);
  return (
    <IconButton
      onClick={onClick}
      color="white"
      title="Toggle color mode"
      _hover={{
        bg: 'hoverBackground',
      }}
      {...rest}
    >
      <Icon />
    </IconButton>
  );
}
