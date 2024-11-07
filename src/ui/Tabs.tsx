'use client';

import {
  TabsContentProps as CUITabsContentProps,
  TabsListProps as CUITabsListProps,
  TabsRootProps as CUITabsRootProps,
  TabsTriggerProps as CUITabsTriggerProps,
  HTMLChakraProps,
  RecipeVariantProps,
  createSlotRecipeContext,
} from '@chakra-ui/react';

import { tabsSlotRecipe } from './theme/recipes/TabsRecipe';

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: tabsSlotRecipe,
});

export type TabsRootProps = HTMLChakraProps<'div', RecipeVariantProps<typeof tabsSlotRecipe>> &
  CUITabsRootProps;

export const TabsRoot = withProvider<HTMLDivElement, TabsRootProps>('div', 'root');

export type TabsListProps = HTMLChakraProps<'div'> & CUITabsListProps;
export const TabsList = withContext<HTMLDivElement, TabsListProps>('div', 'list');

export type TabsTriggerProps = HTMLChakraProps<'button'> & CUITabsTriggerProps;
export const TabsTrigger = withContext<HTMLButtonElement, TabsTriggerProps>('button', 'trigger');

export type TabsContentProps = HTMLChakraProps<'div'> & CUITabsContentProps;
export const TabsContent = withContext<HTMLDivElement, TabsContentProps>('div', 'content');

// TODO: this isn't working as expected. The tabs lose all functionality.
