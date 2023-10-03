import {
  forwardRef,
  Tooltip as CUITooltip,
  TooltipProps as CUITooltipProps,
  useColorMode,
} from '@chakra-ui/react';

export type TooltipProps = CUITooltipProps;
export const Tooltip = forwardRef<TooltipProps, 'div'>(({ children, ...rest }, ref) => (
  <CUITooltip
    placement="top"
    hasArrow
    arrowSize={10}
    p="8px"
    borderRadius="5px"
    bg={`invert.${useColorMode().colorMode}`}
    ref={ref}
    closeOnClick={false}
    {...rest}
  >
    {children}
  </CUITooltip>
));
