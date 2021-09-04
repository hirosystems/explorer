import React from 'react';
import Link from 'next/link';
import { Text, Box, Flex, BoxProps, color, FlexProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs, memoWithAs } from '@stacks/ui-core';

const LinkWrapper: React.FC<any> = ({ children, href }) => {
  return href ? (
    <Link href={href} passHref>
      {children}
    </Link>
  ) : (
    children
  );
};

type FooterLinkProps = { onClick?: any } & BoxProps;

const FooterLink: ForwardRefExoticComponentWithAs<FooterLinkProps, 'a'> = memoWithAs<
  FooterLinkProps,
  'a'
>(
  forwardRefWithAs<FooterLinkProps, 'a'>(({ as = 'a', children, ...rest }, ref) => {
    const externalProps =
      rest.href && !rest.href.startsWith('/')
        ? { target: '_blank', rel: 'noopener noreferrer nofollow' }
        : {};

    return (
      <LinkWrapper href={rest.href}>
        <Text
          cursor="pointer"
          textStyle="body.small"
          color={color('text-caption')}
          textDecoration="none"
          _hover={{ textDecoration: 'underline' }}
          ref={ref}
          as={as}
          {...rest}
          {...externalProps}
        >
          {children}
        </Text>
      </LinkWrapper>
    );
  })
);

export const Footer = React.memo(({ fullWidth, ...props }: FlexProps & { fullWidth?: boolean }) => {
  return (
    <Box width="100%" {...props}>
      <Flex
        pt="base"
        flexDirection={['column', 'column', 'row']}
        alignItems={['center', 'center', 'unset']}
        textAlign={['center', 'center', 'unset']}
        borderTop="1px solid var(--colors-border)"
        px={fullWidth ? ['base', 'base', 'extra-loose'] : 'unset'}
      >
        <Flex pb={['tight', 'tight', 'unset']} pr={['unset', 'unset', 'base']}>
          <FooterLink mr="base" href="/transactions">
            Recent transactions
          </FooterLink>
          <FooterLink href="/sandbox/deploy" mr="base">
            Sandbox
          </FooterLink>
        </Flex>

        <Flex ml={['unset', 'unset', 'auto']}>
          <FooterLink mr="base" href="https://docs.syvita.org">
            Docs
          </FooterLink>
          <FooterLink mr="base" href="https://discord.syvita.org">
            Discord
          </FooterLink>
          <FooterLink mr="base" href="https://github.com/syvita">
            GitHub
          </FooterLink>
          <FooterLink mr="base" href="https://twitter.com/syvitaguild">
            Twitter
          </FooterLink>
        </Flex>
      </Flex>
    </Box>
  );
});
