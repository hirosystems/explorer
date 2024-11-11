'use client';

import { chakra } from '@chakra-ui/react';

import { buttonRecipe } from './theme/componentTheme/Button';

// export type ButtonProps = CUIButtonProps & UIComponent;
// export const Button = forwardRef<ButtonProps, 'button'>(({ children, ...rest }, ref) => (
//   <CUIButton ref={ref} {...rest}>
//     {children}
//   </CUIButton>
// ));

export const Button = chakra('button', buttonRecipe);
