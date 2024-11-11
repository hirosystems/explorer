// 'use client';
// import {
//   Checkbox as CUICheckbox,
//   CheckboxProps as CUICheckboxProps,
//   forwardRef,
// } from '@chakra-ui/react';
// export type CheckboxProps = CUICheckboxProps;
// export const Checkbox = forwardRef<CheckboxProps, 'input'>(({ children, ...rest }, ref) => (
//   <CUICheckbox ref={ref} {...rest}>
//     {children}
//   </CUICheckbox>
// ));
'use client';

import { HTMLChakraProps, RecipeVariantProps, createSlotRecipeContext } from '@chakra-ui/react';

import { checkboxSlotRecipe } from './theme/componentTheme/Checkbox';

// 'use client';

// import {
//   Checkbox as CUICheckbox,
//   CheckboxProps as CUICheckboxProps,
//   forwardRef,
// } from '@chakra-ui/react';

// export type CheckboxProps = CUICheckboxProps;
// export const Checkbox = forwardRef<CheckboxProps, 'input'>(({ children, ...rest }, ref) => (
//   <CUICheckbox ref={ref} {...rest}>
//     {children}
//   </CUICheckbox>
// ));

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: checkboxSlotRecipe,
});

interface CheckboxRootProps
  extends HTMLChakraProps<'label', RecipeVariantProps<typeof checkboxSlotRecipe>> {}
export const CheckboxRoot = withProvider<HTMLLabelElement, CheckboxRootProps>('label', 'root');

interface CheckboxControlProps extends HTMLChakraProps<'input'> {}
export const CheckboxControl = withContext<HTMLInputElement, CheckboxControlProps>(
  'input',
  'control'
);

interface CheckboxLabelProps extends HTMLChakraProps<'span'> {}
export const CheckboxLabel = withContext<HTMLSpanElement, CheckboxLabelProps>('span', 'label');
