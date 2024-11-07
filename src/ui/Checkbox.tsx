'use client';

import type { HTMLChakraProps, RecipeVariantProps } from '@chakra-ui/react';
import {
  CheckboxControlProps as CUICheckboxControlProps,
  CheckboxLabelProps as CUICheckboxLabelProps,
  CheckboxRootProps as CUICheckboxRootProps,
  createSlotRecipeContext,
} from '@chakra-ui/react';

import { checkboxSlotRecipe } from './theme/recipes/CheckboxRecipe';

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: checkboxSlotRecipe,
});

export type CheckboxRootProps = HTMLChakraProps<
  'label',
  RecipeVariantProps<typeof checkboxSlotRecipe>
> &
  CUICheckboxRootProps;
export const CheckboxRoot = withProvider<HTMLLabelElement, CheckboxRootProps>('label', 'root');

export type CheckboxControlProps = HTMLChakraProps<'input'> & CUICheckboxControlProps;
export const CheckboxControl = withContext<HTMLInputElement, CheckboxControlProps>(
  'input',
  'control'
);

export type CheckboxLabelProps = HTMLChakraProps<'span'> & CUICheckboxLabelProps;
export const CheckboxLabel = withContext<HTMLSpanElement, CheckboxLabelProps>('span', 'label');
