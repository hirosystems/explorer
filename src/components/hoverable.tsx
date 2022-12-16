import React, { useContext } from 'react';
import { useHover } from 'web-api-hooks';

import { Box, BoxProps } from '@stacks/ui';

import { bottomLineCss, leftLineCss } from '@common/styles/hover';

const HoverContext = React.createContext(false);

export const useHoverableState = () => {
  return useContext(HoverContext);
};

export const HoverableItem: React.FC<
  { isActive?: boolean; placement?: 'left' | 'bottom' } & BoxProps
> = React.memo(({ children, isActive, placement = 'left', ...props }) => {
  const [isHovered, bind] = useHover();
  return (
    <HoverContext.Provider value={isHovered}>
      <Box
        position="relative"
        _hover={{
          cursor: isActive ? 'unset' : 'pointer',
        }}
        as="span"
        display="block"
        {...bind}
        {...props}
        css={placement === 'left' ? leftLineCss : bottomLineCss}
      >
        {children}
      </Box>
    </HoverContext.Provider>
  );
});
