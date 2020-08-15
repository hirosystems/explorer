import React, { forwardRef, memo, Ref } from 'react';
import { Box, BoxProps, transition } from '@stacks/ui';
import { DarkModeIcon } from '@components/icons/dark-mode';
import { useColorMode } from '@common/hooks/use-color-mode';
import { LightModeIcon } from '@components/icons/light-mode';

export const ColorModeButton = memo(
  forwardRef((props: BoxProps, ref: Ref<HTMLDivElement>) => {
    const [colorMode, toggleColorMode] = useColorMode();
    return (
      <Box
        p="tight"
        borderRadius="100%"
        _hover={{ bg: 'rgba(255,255,255,0.15)', cursor: 'pointer' }}
        color="white"
        onClick={toggleColorMode}
        title="Toggle color mode"
        transition={transition}
        {...props}
        ref={ref}
      >
        {colorMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
      </Box>
    );
  })
);
