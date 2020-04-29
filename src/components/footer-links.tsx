import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Text, Flex, BoxProps, FlexProps } from '@blockstack/ui';

import { fetchTxList } from '@common/api/transactions';

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

const navgiateToRandomTx = async () => {
  const { results } = await fetchTxList();
  const hasNonCoinbaseTxs = results.some(tx => tx.tx_type !== 'coinbase');

  if (hasNonCoinbaseTxs) {
    const nonCoinbaseResults = results.filter(tx => tx.tx_type !== 'coinbase');
    const randomNonCoinbaseTx =
      nonCoinbaseResults[Math.floor(Math.random() * nonCoinbaseResults.length)];

    await Router.push('/txid/[txid]', `/txid/${randomNonCoinbaseTx.tx_id}`);

    return;
  }

  const randomTx = results[Math.floor(Math.random() * results.length)];
  await Router.push('/txid/[txid]', `/txid/${randomTx.tx_id}`);
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
  </Flex>
);
