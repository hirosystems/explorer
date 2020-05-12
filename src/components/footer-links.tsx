import React from 'react';
import Link from 'next/link';
import { Text, Stack, Box, BoxProps, FlexProps } from '@blockstack/ui';
import { useColorMode } from '@common/hooks/use-color-mode';
import { useNavigateToRandomTx } from '@common/hooks/use-random-tx';

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

export const FooterLinks = (props: FlexProps) => {
  const handleRandomTxClick = useNavigateToRandomTx();

  return (
    <Box {...props}>
      <Stack
        isInline
        borderTop="1px solid var(--colors-border)"
        flexGrow={1}
        alignItems="flex-end"
        pt="base"
        spacing="base"
      >
        <FooterLink onClick={handleRandomTxClick} role="link">
          <Text>Random tx</Text>
        </FooterLink>
        <FooterLink>
          <Link href="/sandbox" passHref>
            <Box as="a">Sandbox</Box>
          </Link>
        </FooterLink>

        <ColorModeLink />
        <FooterLink ml="auto">
          <LinkInNewWindow href="https://github.com/blockstack/explorer/">GitHub</LinkInNewWindow>
        </FooterLink>
        <FooterLink>
          <LinkInNewWindow href="https://blockstack.org/legal/privacy-policy">
            Privacy policy
          </LinkInNewWindow>
        </FooterLink>
        <FooterLink>
          <LinkInNewWindow href="https://blockstack.org/legal/terms-of-use">Terms</LinkInNewWindow>
        </FooterLink>
      </Stack>
    </Box>
  );
};
