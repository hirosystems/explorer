import React from 'react';
import Link from 'next/link';

export const TxLink: React.FC<{ txid: string }> = React.memo(({ txid, ...rest }) => (
  <Link
    href={{
      pathname: '/txid/[txid]',
      query: {
        txid,
      },
    }}
    as={`/txid/${txid}`}
    passHref
    {...rest}
  />
));

export const BlockLink: React.FC<{ hash: string }> = ({ hash, ...rest }) => (
  <Link
    href={{
      pathname: '/blocks/[hash]',
      query: {
        hash,
      },
    }}
    as={`/block/${hash}`}
    passHref
    {...rest}
  />
);
