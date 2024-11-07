'use client';

import { SkeletonCircle } from '@/components/ui/skeleton';
import { ClientOnly } from '@chakra-ui/react';
import { Moon, SunDim } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';

import { useColorMode } from '../../../components/ui/color-mode';
import { IconButton, IconButtonProps } from '../../../ui/IconButton';

export function DesktopColorModeButton({ ...rest }: IconButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const icon = useMemo(() => (colorMode === 'light' ? <SunDim /> : <Moon />), [colorMode]);

  const onClick = useCallback(() => {
    toggleColorMode();
  }, [toggleColorMode]);

  return (
    <ClientOnly fallback={<SkeletonCircle size={5} />}>
      <IconButton
        onClick={onClick}
        title="Toggle color mode"
        color="white"
        _hover={{
          bg: 'hoverBackground',
          color: colorMode === 'light' ? 'black' : 'white',
        }}
        variant="primary"
        {...rest}
      >
        {icon}
      </IconButton>
    </ClientOnly>
  );
}
