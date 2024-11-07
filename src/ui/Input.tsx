'use client';

// import { Input as CUIInput, InputProps as CUIInputProps } from '@chakra-ui/react';
// import { forwardRef } from 'react';
// export type InputProps = CUIInputProps;
// export const Input = forwardRef<HTMLInputElement, InputProps>(({ children, ...rest }, ref) => (
//   <CUIInput ref={ref} {...rest}>
//     {children}
//   </CUIInput>
// ));
import {
  Input as CUIInput,
  InputProps as CUIInputProps,
  RecipeVariantProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { inputSlotRecipe } from './theme/recipes/InputRecipe';

// Usually for slot recipes there is a snippet but not for this one...

type InputVariantProps = RecipeVariantProps<typeof inputSlotRecipe>;
export type InputProps = CUIInputProps & InputVariantProps;

export const InputBase = forwardRef<HTMLInputElement, InputProps>(
  ({ children, ...inputProps }, ref) => (
    <CUIInput ref={ref} {...inputProps}>
      {children}
    </CUIInput>
  )
);

export const Input = chakra(InputBase, inputSlotRecipe);
