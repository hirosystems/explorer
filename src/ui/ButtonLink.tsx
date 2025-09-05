'use client';

import { Text } from '@/ui/Text';
import { Flex, Icon, chakra } from '@chakra-ui/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { ReactNode, forwardRef } from 'react';

import { Button, ButtonProps } from './Button';
import { Link, LinkProps } from './Link';
import { NextLink } from './NextLink';
import { linkRecipe } from './theme/recipes/LinkRecipe';

type ButtonLinkType = 'link' | 'button';

type ButtonLinkSize = 'big' | 'small';

type ButtonLinkDirection = 'forward' | 'backward';

type BaseButtonLinkProps = {
  children: ReactNode;
  buttonLinkSize: ButtonLinkSize;
  buttonLinkDirection?: ButtonLinkDirection;
  buttonLinkType?: ButtonLinkType;
};

interface LinkVariantProps
  extends BaseButtonLinkProps,
    Omit<LinkProps, 'variant' | 'size' | 'children'> {}

interface ButtonVariantProps
  extends BaseButtonLinkProps,
    Omit<ButtonProps, 'variant' | 'children'> {}

type ButtonLinkProps = LinkVariantProps | ButtonVariantProps;

const ButtonLinkBase = forwardRef<HTMLElement, ButtonLinkProps>(
  (
    {
      children,
      buttonLinkSize,
      buttonLinkDirection = 'forward',
      buttonLinkType = 'link',
      ...props
    },
    ref
  ) => {
    const arrowIcon = (
      <Icon
        w={buttonLinkSize === 'big' ? 3.5 : 3}
        h={buttonLinkSize === 'big' ? 3.5 : 3}
        color="iconTertiary"
        _groupHover={{
          color: 'iconPrimary',
        }}
        aria-hidden="true"
      >
        {buttonLinkDirection === 'forward' ? <ArrowRight /> : <ArrowLeft />}
      </Icon>
    );

    const content = (
      <Flex className="group" gap={1} alignItems={'center'}>
        {buttonLinkDirection === 'backward' && arrowIcon}
        <Text
          textStyle={buttonLinkSize === 'big' ? 'text-medium-sm' : 'text-medium-xs'}
          color="textPrimary"
          whiteSpace={'nowrap'}
        >
          {children}
        </Text>
        {buttonLinkDirection === 'forward' && arrowIcon}
      </Flex>
    );

    // Button variant
    if (buttonLinkType === 'button') {
      const { onClick, ...buttonProps } = props as ButtonVariantProps;
      return (
        <Button
          ref={ref as React.Ref<HTMLButtonElement>}
          onClick={onClick}
          variant="buttonLink"
          {...buttonProps}
        >
          {content}
        </Button>
      );
    }

    // Link variant (default)
    const { href, ...linkProps } = props as LinkVariantProps;
    const isExternal = href?.startsWith('http');

    return isExternal ? (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        variant="buttonLink"
        w="fit-content"
        {...linkProps}
      >
        {content}
      </Link>
    ) : (
      <NextLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        variant="buttonLink"
        w="fit-content"
        {...linkProps}
      >
        {content}
      </NextLink>
    );
  }
);

export const ButtonLink = chakra(ButtonLinkBase, linkRecipe);
