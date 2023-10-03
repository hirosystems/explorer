import {
  forwardRef,
  InputElementProps as CUIInputLeftElementProps,
  InputLeftElement as CUIInputLeftElement,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type InputLeftElementProps = CUIInputLeftElementProps & UIComponent;
export const InputLeftElement = forwardRef<InputLeftElementProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUIInputLeftElement
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      borderColor={`border.${useColorMode().colorMode}`}
      {...rest}
    >
      {children}
    </CUIInputLeftElement>
  )
);
