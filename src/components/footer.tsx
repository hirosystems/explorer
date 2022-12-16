import Link from 'next/link';
import React from 'react';

import { Box, BoxProps, Flex, FlexProps, Text, color } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs, memoWithAs } from '@stacks/ui-core';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

import { buildUrl } from '@components/links';

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
  const network = useAppSelector(selectActiveNetwork);
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
        <Flex display="flex" flexDirection={'column'} gap="5px">
          <Flex pb={['tight', 'tight', 'unset']} pr={['unset', 'unset', 'base']}>
            <FooterLink mr="base" href={buildUrl('/transactions', network)}>
              Recent transactions
            </FooterLink>
            <FooterLink href={buildUrl('/sandbox/deploy', network)} mr="base">
              Sandbox
            </FooterLink>
            <FooterLink href="https://immunefi.com/bounty/stacks/" mr="base" target="_blank">
              Found a bug in the Stacks Blockchain?
            </FooterLink>
          </Flex>
          <Box>
            <FooterLink mr="base" target="_blank" href="https://www.coingecko.com/">
              Market data provided by CoinGecko
            </FooterLink>
          </Box>
        </Flex>

        <Flex ml={['unset', 'unset', 'auto']}>
          <FooterLink
            mr="base"
            target="_blank"
            href="https://github.com/hirosystems/explorer/issues/new/choose"
          >
            Submit report or request
          </FooterLink>
          <FooterLink mr="base" href="mailto:support@hiro.so">
            Support
          </FooterLink>
          <FooterLink href="https://www.hiro.so/p/terms-privacy">Terms & Privacy</FooterLink>
        </Flex>
      </Flex>
    </Box>
  );
});
