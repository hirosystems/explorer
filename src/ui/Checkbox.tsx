'use client';

import type { RecipeVariantProps } from '@chakra-ui/react';
import { chakra, useSlotRecipe } from '@chakra-ui/react';

import { checkboxSlotRecipe } from './theme/recipes/CheckboxRecipe';

type CheckboxVariantProps = RecipeVariantProps<typeof checkboxSlotRecipe>;

export interface CheckboxProps extends React.PropsWithChildren<CheckboxVariantProps> {}

export const Checkbox = (props: CheckboxProps) => {
  const recipe = useSlotRecipe({ recipe: checkboxSlotRecipe });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);
  const styles = recipe(recipeProps);

  return (
    <chakra.label css={styles.root}>
      <chakra.input type="checkbox" css={styles.control} {...restProps} />
      <chakra.span css={styles.label}>Checkbox Label</chakra.span>
    </chakra.label>
  );
};

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
