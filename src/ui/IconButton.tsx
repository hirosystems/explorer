'use client';

import {
  IconButton as CUIIconButton,
  IconButtonProps as CUIIconButtonProps,
  RecipeVariantProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { iconButtonRecipe } from './theme/recipes/IconButtonRecipe';
import { UIComponent } from './types';

type IconButtonVariantProps = RecipeVariantProps<typeof iconButtonRecipe>;
export type IconButtonProps = Omit<CUIIconButtonProps, 'size'> &
  UIComponent &
  IconButtonVariantProps;
export const IconButtonBase = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIIconButton
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      bg={'transparent'} // TODO: these are in theme via recipe, but it's not working
      _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
      borderRadius={'full'}
      {...rest}
    >
      {children}
    </CUIIconButton>
  )
);

export const IconButton = chakra(IconButtonBase, iconButtonRecipe);
