import { Box, BoxProps } from '@stacks/ui';

import React from 'react';

import { color } from '@components/color-modes';

export const FloatingHoverIndicator: React.FC<BoxProps & { isHovered?: boolean }> = ({
  isHovered,
  ...props
}) => (
  <Box
    borderRadius="3px"
    position="absolute"
    left="-24px"
    width="3px"
    height="calc(100%)"
    top="0px"
    transform={isHovered ? 'none' : 'scaleY(0)'}
    transition="all 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
    willChange="transform"
    bg={color('accent')}
    {...props}
  />
);
