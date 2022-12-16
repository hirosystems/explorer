import Link from 'next/link';
import React, { FC } from 'react';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { Network } from '@common/types/network';

export const buildUrl = (path: string, network: Network) => {
  const url = `${path}?chain=${encodeURIComponent(network?.mode)}`;
  if (network?.isCustomNetwork) {
    return `${url}&api=${network.url}`;
  }
  return url;
};

export const ExplorerLink: FC<{ path: string }> = ({ path, ...rest }) => {
  const network = useAppSelector(selectActiveNetwork);
  return <Link href={buildUrl(path, network)} passHref {...rest} />;
};

export const TxLink: React.FC<{ txid: string }> = React.memo(({ txid, ...rest }) => {
  return <ExplorerLink path={`/txid/${encodeURIComponent(txid)}`} {...rest} />;
});

export const MicroblockLink: React.FC<{ hash: string }> = React.memo(({ hash, ...rest }) => {
  return <ExplorerLink path={`/microblock/${encodeURIComponent(hash)}`} {...rest} />;
});

export const BlockLink: React.FC<{ hash: string }> = React.memo(({ hash, ...rest }) => {
  return <ExplorerLink path={`/block/${encodeURIComponent(hash)}`} {...rest} />;
});

export const AddressLink: React.FC<{ principal: string }> = React.memo(({ principal, ...rest }) => {
  return principal.includes('.') ? (
    <TxLink txid={principal} {...rest} />
  ) : (
    <ExplorerLink path={`/address/${encodeURIComponent(principal)}`} {...rest} />
  );
});
