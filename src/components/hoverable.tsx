import React, { useContext } from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { useHover } from 'web-api-hooks';
import { bottomLineCss, leftLineCss, accountPageCss } from '@common/styles/hover';

const HoverContext = React.createContext(false);

export const useHoverableState = () => {
  return useContext(HoverContext);
};

export const HoverableItem: React.FC<
  { isActive?: boolean; placement?: 'left' | 'bottom' | 'account' } & BoxProps
> = React.memo(({ children, isActive, placement = 'left', ...props }) => {
  const [isHovered, bind] = useHover();
  let cssType = leftLineCss; 
  switch (placement) {
    case 'bottom':
      cssType = bottomLineCss; 
      break; 
    case 'account': 
      cssType = accountPageCss; 
      break;
  };

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
        css={cssType}
      >
        {children}
      </Box>
    </HoverContext.Provider>
  );
});
