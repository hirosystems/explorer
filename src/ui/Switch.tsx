'use client';

import type { HTMLChakraProps, RecipeVariantProps } from '@chakra-ui/react';
import {
  Switch as CUISwitch,
  SwitchControlProps as CUISwitchControlProps,
  SwitchLabelProps as CUISwitchLabelProps,
  SwitchRootProps as CUISwitchRootProps,
  createSlotRecipeContext,
} from '@chakra-ui/react';

import { switchSlotRecipe } from './theme/recipes/SwitchRecipe';

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: switchSlotRecipe,
});

export type SwitchRootProps = HTMLChakraProps<
  'label',
  RecipeVariantProps<typeof switchSlotRecipe>
> &
  CUISwitchRootProps;
export const SwitchRoot = withProvider<HTMLInputElement, SwitchRootProps>('input', 'root');

export type SwitchControlProps = HTMLChakraProps<'span'> & CUISwitchControlProps;
export const SwitchControl = withContext<HTMLSpanElement, SwitchControlProps>('span', 'control');

export type SwitchLabelProps = HTMLChakraProps<'span'> & CUISwitchLabelProps;
export const SwitchLabel = withContext<HTMLSpanElement, SwitchLabelProps>('span', 'label');
