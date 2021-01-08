import React, { forwardRef, memo, Ref } from 'react';
import { IconButton, IconButtonProps, useColorMode } from '@stacks/ui';
import { IconSun, IconSunOff } from '@tabler/icons';

const ColorModeButton = memo(
  forwardRef((props: Omit<IconButtonProps, 'icon'>, ref: Ref<HTMLDivElement>) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const Icon = colorMode === 'light' ? IconSun : IconSunOff;
    return (
      <IconButton
        icon={Icon}
        onClick={toggleColorMode}
        invert
        color="white"
        title="Toggle color mode"
        {...(props as any)}
        ref={ref as any}
      />
    );
  })
);

export default ColorModeButton;
