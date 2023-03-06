'use client';

import {
  Checkbox as CUICheckbox,
  CheckboxProps as CUICheckboxProps,
  forwardRef,
} from '@chakra-ui/react';

export type CheckboxProps = CUICheckboxProps;
export const Checkbox = forwardRef<CheckboxProps, 'input'>(({ children, ...rest }, ref) => (
  <CUICheckbox ref={ref} {...rest}>
    {children}
  </CUICheckbox>
));
