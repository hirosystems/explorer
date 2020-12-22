import React, { forwardRef, memo, Ref } from 'react';
import { BoxProps } from '@stacks/ui';
import { useColorMode } from '@common/hooks/use-color-mode';
import { IconButton } from '@components/icon-button';
import { IconSun, IconSunOff } from '@tabler/icons';

const ColorModeButton = memo(
  forwardRef((props: BoxProps, ref: Ref<HTMLDivElement>) => {
    const [colorMode, toggleColorMode] = useColorMode();
    const Icon = colorMode === 'light' ? IconSun : IconSunOff;
    return (
      <IconButton
        icon={Icon}
        onClick={toggleColorMode}
        title="Toggle color mode"
        {...(props as any)}
        ref={ref as any}
      />
    );
  })
);

export default ColorModeButton;
