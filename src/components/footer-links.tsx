import React from 'react';
import Link from 'next/link';
import { Text, Flex, BoxProps } from '@blockstack/ui';
import { fetchTxList } from '@common/api/transactions';
import Router from 'next/router';

const FooterLink: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    cursor="pointer"
    textStyle="body.small"
    mr="base"
    color="ink.600"
    _hover={{ textDecoration: 'underline' }}
    {...rest}
  >
    {children}
  </Text>
);

export const FooterLinks = () => (
  <Flex flex={1} alignItems="flex-end" mb={['base', 'base-loose', 'loose']}>
    <FooterLink
      onClick={async () => {
        const { results } = await fetchTxList();
        const randomTx = results[Math.floor(Math.random() * results.length)];
        const hasNonCoinbaseTxs = results.some(tx => tx.tx_type !== 'coinbase');
        if (hasNonCoinbaseTxs) {
          const nonCoinbaseResults = results.filter(tx => tx.tx_type !== 'coinbase');
          const randomNonCoinbaseTx =
            nonCoinbaseResults[Math.floor(Math.random() * nonCoinbaseResults.length)];
          await Router.push('/txid/[txid]', `/txid/${randomNonCoinbaseTx.tx_id}`);
          return;
        }
        await Router.push('/txid/[txid]', `/txid/${randomTx.tx_id}`);
      }}
    >
      <a href="#">Random transaction</a>
    </FooterLink>
    <FooterLink>
      <Link href="/components">
        <a>Colophon</a>
      </Link>
    </FooterLink>
    <FooterLink>
      <a href="https://docs.blockstack.org/">Docs</a>
    </FooterLink>
    <FooterLink>
      <a href="https://blockstack.github.io/stacks-blockchain-sidecar/">API</a>
    </FooterLink>
  </Flex>
);
