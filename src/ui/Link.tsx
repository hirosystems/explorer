'use client';

import {
  Link as CUILink,
  LinkProps as CUILinkProps,
  RecipeVariantProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { linkRecipe } from './theme/recipes/LinkRecipe';

type LinkVariantProps = RecipeVariantProps<typeof linkRecipe>;
export type LinkProps = CUILinkProps & LinkVariantProps;

export const LinkBase = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, ...linkProps }, ref) => (
    <CUILink ref={ref} {...linkProps}>
      {children}
    </CUILink>
  )
);

export const Link = chakra(LinkBase, linkRecipe);
