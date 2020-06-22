import React, { forwardRef, memo, Ref } from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { DarkModeIcon } from '@components/icons/dark-mode';
import { color } from '@components/color-modes';
import { useColorMode } from '@common/hooks/use-color-mode';
import { LightModeIcon } from '@components/icons/light-mode';

export const ColorModeButton = memo(
  forwardRef((props: BoxProps, ref: Ref<HTMLDivElement>) => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
      <Box
        p="tight"
        borderRadius="4px"
        _hover={{ bg: color('bg-alt'), cursor: 'pointer' }}
        color={color('invert')}
        onClick={toggleColorMode}
        title="Toggle color mode"
        {...props}
        ref={ref}
      >
        {colorMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
      </Box>
    );
  })
);
