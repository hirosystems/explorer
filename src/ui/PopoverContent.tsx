import {
  forwardRef,
  PopoverContent as CUIPopoverContent,
  PopoverContentProps as CUIPopoverContentProps,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type PopoverContentProps = CUIPopoverContentProps & UIComponent;
export const PopoverContent = forwardRef<PopoverContentProps, 'section'>(
  ({ children, size, ...rest }, ref) => (
    <CUIPopoverContent
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      borderColor={`border.${useColorMode().colorMode}`}
      {...rest}
    >
      {children}
    </CUIPopoverContent>
  )
);
