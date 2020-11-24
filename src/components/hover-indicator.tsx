import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { color } from '@components/color-modes';

export const FloatingHoverIndicator: React.FC<
  BoxProps & { isHovered?: boolean; isActive?: boolean; placement?: 'left' | 'bottom' }
> = ({ isHovered, placement = 'left', isActive, ...props }) => {
  const styles =
    placement === 'left'
      ? {
          left: '-24px',
          width: '3px',
          top: '0px',
          height: 'calc(100%)',
        }
      : { left: '0', height: '2px', top: '100%', width: 'calc(100%)' };
  return (
    <Box
      borderRadius="3px"
      position="absolute"
      transform={
        isActive ? 'none' : !isHovered ? `scale${placement === 'left' ? 'Y' : 'X'}(0)` : 'none'
      }
      transition="all 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
      willChange="transform"
      bg={color('accent')}
      {...styles}
      {...props}
    />
  );
};
