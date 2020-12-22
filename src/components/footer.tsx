import React from 'react';
import Link from 'next/link';
import { Text, Box, Flex, BoxProps, color, FlexProps } from '@stacks/ui';
import { useColorMode } from '@common/hooks/use-color-mode';
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
        ? { target: '_blank', rel: 'noopener noreferrer' }
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
          <FooterLink href="/sandbox" mr="base">
            Sandbox
          </FooterLink>
        </Flex>

        <Flex ml={['unset', 'unset', 'auto']}>
          <FooterLink
            mr="base"
            href="https://blocksurvey.io/survey/1Pb7eeibpfM98hRKBfMUULYCh9BivxE86q/1128356d-4048-48ca-a456-052ef8c5526e"
          >
            Give feedback
          </FooterLink>
          <FooterLink mr="base" href="https://www2.blockstack.org/explorer/faq">
            FAQ
          </FooterLink>
          <FooterLink mr="base" href="https://github.com/blockstack/explorer/">
            GitHub
          </FooterLink>
          <FooterLink href="https://www.blockstack.org/p/terms-privacy">Terms & Privacy</FooterLink>
        </Flex>
      </Flex>
    </Box>
  );
});
