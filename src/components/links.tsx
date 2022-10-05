import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

export const buildUrl = (path: string, networkMode?: string) =>
  `${path}?chain=${encodeURIComponent(networkMode || useAppSelector(selectActiveNetwork).mode)}`;

export const TxLink: React.FC<{ txid: string }> = React.memo(({ txid, ...rest }) => (
  <Link href={buildUrl(`/txid/${encodeURIComponent(txid)}`)} passHref {...rest} />
));

export const MicroblockLink: React.FC<{ hash: string }> = React.memo(({ hash, ...rest }) => (
  <Link href={buildUrl(`/microblock/${encodeURIComponent(hash)}`)} passHref {...rest} />
));

export const BlockLink: React.FC<{ hash: string; networkMode?: string }> = React.memo(
  ({ hash, networkMode, ...rest }) => (
    <Link href={buildUrl(`/block/${encodeURIComponent(hash)}`, networkMode)} passHref {...rest} />
  )
);

export const AddressLink: React.FC<{ principal: string }> = React.memo(({ principal, ...rest }) =>
  principal.includes('.') ? (
    <TxLink txid={principal} {...rest} />
  ) : (
    <Link href={buildUrl(`/address/${encodeURIComponent(principal)}`)} passHref {...rest} />
  )
);
