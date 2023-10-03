import {
  Flex as CUIFlex,
  FlexProps as CUIFlexProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type FlexProps = CUIFlexProps & UIComponent;
export const Flex = forwardRef<FlexProps, 'div'>(({ children, ...rest }, ref) => (
  <CUIFlex ref={ref} borderColor={`border.${useColorMode().colorMode}`} {...rest}>
    {children}
  </CUIFlex>
));
