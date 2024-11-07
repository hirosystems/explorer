'use client';

import { chakra, Button as CUIButton, ButtonProps as CUIButtonProps, forwardRef } from '@chakra-ui/react';

import { UIComponent } from './types';
import { buttonRecipe } from './theme/componentTheme/Button';

// export type ButtonProps = CUIButtonProps & UIComponent;
// export const Button = forwardRef<ButtonProps, 'button'>(({ children, ...rest }, ref) => (
//   <CUIButton ref={ref} {...rest}>
//     {children}
//   </CUIButton>
// ));

export const Button = chakra("button", buttonRecipe)
