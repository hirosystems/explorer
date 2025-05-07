'use client';

import { Text } from '@/ui/Text';
import { Flex, Icon, chakra } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import { ReactNode, forwardRef } from 'react';

import { Link, LinkProps } from './Link';
import { NextLink } from './NextLink';
import { linkRecipe } from './theme/recipes/LinkRecipe';

type ButtonLinkSize = 'big' | 'small';

type ButtonLinkProps = Omit<LinkProps, 'variant' | 'size'> & {
  children: ReactNode;
  buttonLinkSize: ButtonLinkSize;
};

const ButtonLinkBase = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, buttonLinkSize, ...linkProps }, ref) => {
    const isExternal = linkProps?.href?.startsWith('http');

    const content = (
      <Flex alignItems="center" gap={1} className="group">
        <Text
          textStyle={buttonLinkSize === 'big' ? 'text-medium-sm' : 'text-medium-xs'}
          color="textPrimary"
        >
          {children}
        </Text>
        <Icon
          w={buttonLinkSize === 'big' ? 3.5 : 3}
          h={buttonLinkSize === 'big' ? 3.5 : 3}
          color="iconTertiary"
          _groupHover={{
            color: 'iconPrimary',
          }}
          aria-hidden="true"
        >
          <ArrowRight />
        </Icon>
      </Flex>
    );

    return isExternal ? (
      <Link
        ref={ref}
        {...linkProps}
        variant="buttonLink"
        h={buttonLinkSize === 'big' ? 6 : 5}
        w="fit-content"
      >
        {content}
      </Link>
    ) : (
      <NextLink
        ref={ref}
        {...linkProps}
        variant="buttonLink"
        h={buttonLinkSize === 'big' ? 6 : 5}
        w="fit-content"
      >
        {content}
      </NextLink>
    );
  }
);

export const ButtonLink = chakra(ButtonLinkBase, linkRecipe);
