'use client';

import {
  Input as CUIInput,
  InputProps as CUIInputProps,
  RecipeVariantProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { inputRecipe } from './theme/recipes/InputRecipe';

type InputVariantProps = RecipeVariantProps<typeof inputRecipe>;
export type InputProps = CUIInputProps & InputVariantProps;

export const InputBase = forwardRef<HTMLInputElement, InputProps>(
  ({ children, ...inputProps }, ref) => (
    <CUIInput ref={ref} {...inputProps}>
      {children}
    </CUIInput>
  )
);

export const Input = chakra(InputBase, inputRecipe);
