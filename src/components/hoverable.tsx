import React, { useContext } from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { useHover } from 'web-api-hooks';
import { FloatingHoverIndicator } from '@components/hover-indicator';

const HoverContext = React.createContext(false);

export const useHoverableState = () => {
  return useContext(HoverContext);
};

export const HoverableItem: React.FC<
  { isLast?: boolean; isActive?: boolean; placement?: 'left' | 'bottom' } & BoxProps
> = React.memo(({ isLast, children, isActive, placement = 'left', ...props }) => {
  const [isHovered, bind] = useHover();
  return (
    <HoverContext.Provider value={isHovered}>
      <Box
        borderBottom={isLast ? 'unset' : '1px solid'}
        borderBottomColor="var(--colors-border)"
        position="relative"
        _hover={{
          cursor: isActive ? 'unset' : 'pointer',
        }}
        as="span"
        display="block"
        {...bind}
        {...props}
      >
        <FloatingHoverIndicator isActive={isActive} placement={placement} isHovered={isHovered} />
        {children}
      </Box>
    </HoverContext.Provider>
  );
});
