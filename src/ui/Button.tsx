'use client';

import { Button as CUIButton, ButtonProps as CUIButtonProps, chakra } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { buttonRecipe } from './theme/recipes/ButtonRecipe';
import { UIComponent } from './types';

export type ButtonProps = CUIButtonProps & UIComponent;
export const ButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...buttonProps }, ref) => (
    <CUIButton ref={ref} {...buttonProps}>
      {children}
    </CUIButton>
  )
);

export const Button = chakra(ButtonBase, buttonRecipe);
