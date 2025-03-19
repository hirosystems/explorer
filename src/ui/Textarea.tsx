'use client';

import {
  Textarea as CUITextarea,
  TextareaProps as CUITextareaProps,
  RecipeVariantProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { textareaRecipe } from './theme/recipes/TextareaRecipe';

type TextareaVariantProps = RecipeVariantProps<typeof textareaRecipe>;
export type TextareaProps = CUITextareaProps & TextareaVariantProps;

export const TextareaBase = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ children, ...textareaProps }, ref) => (
    <CUITextarea ref={ref} {...textareaProps}>
      {children}
    </CUITextarea>
  )
);

export const Textarea = chakra(TextareaBase, textareaRecipe);
