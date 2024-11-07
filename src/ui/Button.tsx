'use client';

import {
  Button as CUIButton,
  ButtonProps as CUIButtonProps,
  RecipeVariantProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { buttonRecipe } from './theme/recipes/ButtonRecipe';

type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>;
export type ButtonProps = CUIButtonProps & ButtonVariantProps;

const ButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...buttonProps }, ref) => (
    <CUIButton ref={ref} {...buttonProps}>
      {children}
    </CUIButton>
  )
);

export const Button = chakra(ButtonBase, buttonRecipe);
