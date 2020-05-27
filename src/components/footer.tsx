import React from 'react';
import Link from 'next/link';
import { Text, Box, Flex, BoxProps, FlexProps } from '@blockstack/ui';
import { useColorMode } from '@common/hooks/use-color-mode';

const FooterLink: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    cursor="pointer"
    textStyle="body.small"
    color="var(--colors-text-caption)"
    _hover={{ textDecoration: 'underline' }}
    {...rest}
  >
    {children}
  </Text>
);

const ColorModeLink = ({ ...rest }) => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <FooterLink onClick={toggleColorMode} {...rest}>
      {colorMode === 'light' ? 'Dark mode' : 'Light mode'}
    </FooterLink>
  );
};

const LinkInNewWindow = React.forwardRef((props: any, ref: any) => (
  <Text as="a" target="_blank" rel="noopener noreferrer" ref={ref} {...props} />
));

export const Footer = (props: FlexProps) => {
  return (
    <Box width="100%" {...props}>
      <Flex
        pt="base"
        flexDir={['column', 'column', 'row']}
        align={['center', 'center', 'unset']}
        textAlign={['center', 'center', 'unset']}
        borderTop="1px solid var(--colors-border)"
      >
        <Flex pb={['tight', 'tight', 'unset']} pr={['unset', 'unset', 'base']}>
          <FooterLink mr="base">
            <Link href="/transactions" passHref>
              <Text as="a">Recent transactions</Text>
            </Link>
          </FooterLink>
          <FooterLink mr="base">
            <Link href="/sandbox" passHref>
              <Box as="a">Sandbox</Box>
            </Link>
          </FooterLink>
          <ColorModeLink />
        </Flex>

        <Flex ml={['unset', 'unset', 'auto']}>
          <FooterLink mr="base">
            <LinkInNewWindow href="https://www2.blockstack.org/explorer/faq">FAQ</LinkInNewWindow>
          </FooterLink>
          <FooterLink mr="base">
            <LinkInNewWindow href="https://github.com/blockstack/explorer/">GitHub</LinkInNewWindow>
          </FooterLink>
          <FooterLink mr="base">
            <LinkInNewWindow href="https://blockstack.org/legal/privacy-policy">
              Privacy policy
            </LinkInNewWindow>
          </FooterLink>
          <FooterLink>
            <LinkInNewWindow href="https://blockstack.org/legal/terms-of-use">
              Terms
            </LinkInNewWindow>
          </FooterLink>
        </Flex>
      </Flex>
    </Box>
  );
};
