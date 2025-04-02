'use client';

import { Text } from '@/ui/Text';
import { Flex, Icon, chakra } from '@chakra-ui/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { ReactNode, forwardRef } from 'react';

import { Link, LinkProps } from './Link';
import { NextLink } from './NextLink';
import { linkRecipe } from './theme/recipes/LinkRecipe';

type ButtonLinkSize = 'big' | 'small';

type ButtonLinkDirection = 'forward' | 'backward';

type ButtonLinkProps = Omit<LinkProps, 'variant' | 'size'> & {
  children: ReactNode;
  buttonLinkSize: ButtonLinkSize;
  buttonLinkDirection?: ButtonLinkDirection;
};

const ButtonLinkBase = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, buttonLinkSize, buttonLinkDirection = 'forward', ...linkProps }, ref) => {
    const isExternal = linkProps?.href?.startsWith('http');

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

    return isExternal ? (
      <Link ref={ref} variant="buttonLink" w="fit-content" {...linkProps}>
        {content}
      </Link>
    ) : (
      <NextLink ref={ref} variant="buttonLink" w="fit-content" {...linkProps}>
        {content}
      </NextLink>
    );
  }
);

export const ButtonLink = chakra(ButtonLinkBase, linkRecipe);
