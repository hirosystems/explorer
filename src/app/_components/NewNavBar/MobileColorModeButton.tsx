'use client';

import { SkeletonCircle } from '@/components/ui/skeleton';
import { ClientOnly } from '@chakra-ui/react';
import { Moon, SunDim } from '@phosphor-icons/react';
import { useCallback } from 'react';

import { useColorMode } from '../../../components/ui/color-mode';
import { IconButton, IconButtonProps } from '../../../ui/IconButton';

export function MobileColorModeButton({
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
    <ClientOnly fallback={<SkeletonCircle size={5} />}>
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
    </ClientOnly>
  );
}
