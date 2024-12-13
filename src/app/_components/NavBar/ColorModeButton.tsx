'use client';

import { Moon, SunDim } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';

import { useColorMode } from '../../../components/ui/color-mode';
import { IconButton, IconButtonProps } from '../../../ui/IconButton';

export function ColorModeButton({ ...rest }: IconButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const icon = useMemo(() => (colorMode === 'light' ? <SunDim /> : <Moon />), [colorMode]);

  const onClick = useCallback(() => {
    toggleColorMode();
  }, [toggleColorMode]);

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
