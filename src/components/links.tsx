import React from 'react';
import Link from 'next/link';

export const TxLink: React.FC<{ txid: string }> = React.memo(({ txid, ...rest }) => (
  <Link href={`/txid/${txid}`} passHref {...rest} />
));

export const BlockLink: React.FC<{ hash: string }> = ({ hash, ...rest }) => (
  <Link href={`/block/${hash}`} passHref {...rest} />
);
