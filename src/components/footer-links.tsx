import React from 'react';
import Link from 'next/link';
import { Text, Flex, BoxProps, FlexProps } from '@blockstack/ui';
import { useColorMode } from '@common/hooks/use-color-mode';
import { navgiateToRandomTx } from '@common/utils';

const FooterLink: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    cursor="pointer"
    textStyle="body.small"
    mr="base"
    color="var(--colors-text-caption)"
    _hover={{ textDecoration: 'underline' }}
    {...rest}
  >
    {children}
  </Text>
);

const ColorModeLink = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <FooterLink onClick={toggleColorMode}>
      {colorMode === 'light' ? 'Dark mode' : 'Light mode'}
    </FooterLink>
  );
};

const LinkInNewWindow = (props: any) => (
  <Text as="a" target="_blank" rel="noopener noreferrer" {...props} />
);

export const FooterLinks = (props: FlexProps) => (
  <Flex flex={1} alignItems="flex-end" mb={['base', 'base-loose', 'loose']} {...props}>
    <FooterLink onClick={navgiateToRandomTx}>
      <a href="#">Random transaction</a>
    </FooterLink>
    <FooterLink>
      <Link href="/debug" passHref>
        <LinkInNewWindow>Debug</LinkInNewWindow>
      </Link>
    </FooterLink>
    <FooterLink>
      <LinkInNewWindow href="https://docs.blockstack.org/">Docs</LinkInNewWindow>
    </FooterLink>
    <FooterLink>
      <LinkInNewWindow href="https://blockstack.github.io/stacks-blockchain-sidecar/">
        API
      </LinkInNewWindow>
    </FooterLink>
    <FooterLink>
      <LinkInNewWindow href="https://github.com/blockstack/explorer/">GitHub</LinkInNewWindow>
    </FooterLink>
    <ColorModeLink />
  </Flex>
);
