'use client';

import { Assign, TabsRootProps as CUITabsRootProps } from '@ark-ui/react';
import { Tabs as ArkTabs } from '@ark-ui/react/tabs';
import {
  HTMLChakraProps,
  RecipeVariantProps,
  SlotRecipeProps,
  UnstyledProp,
  createSlotRecipeContext,
} from '@chakra-ui/react';

import { tabsSlotRecipe } from './theme/recipes/TabsRecipe';

const {
  withProvider,
  withContext,
  useStyles: useTabsStyles,
  PropsProvider,
} = createSlotRecipeContext({ recipe: tabsSlotRecipe });

export { useTabsStyles };

export interface TabsRootProviderBaseProps
  extends Assign<ArkTabs.RootProviderBaseProps, SlotRecipeProps<'tabs'>>,
    UnstyledProp {}

export interface TabsRootProviderProps extends HTMLChakraProps<'div', TabsRootProviderBaseProps> {}

export const TabsRootProvider = withProvider<HTMLDivElement, TabsRootProviderProps>(
  ArkTabs.RootProvider,
  'root',
  { forwardAsChild: true }
);

export interface TabsRootBaseProps
  extends Assign<ArkTabs.RootBaseProps, SlotRecipeProps<'tabs'>>,
    UnstyledProp {}

export type TabsRootProps = HTMLChakraProps<'div', RecipeVariantProps<typeof tabsSlotRecipe>> &
  CUITabsRootProps;

export const TabsRoot = withProvider<HTMLDivElement, TabsRootProps>(ArkTabs.Root, 'root', {
  forwardAsChild: true,
});

export const TabsPropsProvider = PropsProvider as React.Provider<TabsRootBaseProps>;

export interface TabsTriggerProps extends HTMLChakraProps<'button', ArkTabs.TriggerBaseProps> {}

export const TabsTrigger = withContext<HTMLButtonElement, TabsTriggerProps>(
  ArkTabs.Trigger,
  'trigger',
  { forwardAsChild: true }
);

export interface TabsContentProps extends HTMLChakraProps<'div', ArkTabs.ContentBaseProps> {}

export const TabsContent = withContext<HTMLDivElement, TabsContentProps>(
  ArkTabs.Content,
  'content',
  { forwardAsChild: true }
);

export interface TabsContentGroupProps extends HTMLChakraProps<'div'> {}

export const TabsContentGroup = withContext<HTMLDivElement, TabsContentGroupProps>('div');

export interface TabsListProps extends HTMLChakraProps<'div', ArkTabs.ListBaseProps> {}

export const TabsList = withContext<HTMLDivElement, TabsListProps>(ArkTabs.List, 'list', {
  forwardAsChild: true,
});

export interface TabsIndicatorProps extends HTMLChakraProps<'div', ArkTabs.ListBaseProps> {}

export const TabsIndicator = withContext<HTMLDivElement, TabsIndicatorProps>(
  ArkTabs.Indicator,
  'indicator',
  { forwardAsChild: true }
);

export const TabsContext = ArkTabs.Context;

export interface TabsValueChangeDetails extends ArkTabs.ValueChangeDetails {}

export interface TabsLabelProps extends HTMLChakraProps<'div'> {}

export const TabsLabel = withContext<HTMLDivElement, TabsLabelProps>('div', 'label', {
  forwardAsChild: true,
});
