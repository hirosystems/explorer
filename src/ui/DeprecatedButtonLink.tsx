'use client';

import { chakra } from '@chakra-ui/react';
import { ReactNode, forwardRef } from 'react';

import { Button, ButtonProps } from './Button';
import { Link, LinkProps } from './Link';
import { NextLink } from './NextLink';
import { buttonRecipe } from './theme/recipes/ButtonRecipe';

const ButtonLinkBase = forwardRef<
  HTMLAnchorElement,
  { children: ReactNode; isExternal?: boolean; buttonProps?: ButtonProps; linkProps?: LinkProps }
>(({ children, isExternal, buttonProps, linkProps }, ref) =>
  isExternal ? (
    <Link variant="noUnderline" ref={ref} {...linkProps}>
      <Button {...buttonProps}>{children}</Button>
    </Link>
  ) : (
    <NextLink variant="noUnderline" ref={ref} {...linkProps}>
      <Button {...buttonProps}>{children}</Button>
    </NextLink>
  )
);

export const DeprecatedButtonLink = chakra(ButtonLinkBase, buttonRecipe);
