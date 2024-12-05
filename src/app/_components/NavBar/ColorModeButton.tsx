'use client';

import { Moon, SunDim } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';

import { useColorMode } from '../../../components/ui/color-mode';
import { IconButton, IconButtonProps } from '../../../ui/IconButton';

export function ColorModeButton({
  colorModeOverride,
  ...rest
}: {
  colorModeOverride?: 'light' | 'dark';
} & IconButtonProps) {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const icon = useMemo(
    () =>
      colorModeOverride ? (
        colorModeOverride === 'light' ? (
          <SunDim />
        ) : (
          <Moon />
        )
      ) : colorMode === 'light' ? (
        <SunDim />
      ) : (
        <Moon />
      ),
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
      title="Toggle color mode"
      color="white"
      _hover={{
        bg: 'hoverBackground',
        color: colorMode === 'light' ? 'black' : 'white',
      }}
      {...rest}
    >
      {icon}
    </IconButton>
  );
}
