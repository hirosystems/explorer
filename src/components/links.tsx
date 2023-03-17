import { useGlobalContext } from '@/common/context/useAppContext';
import { Network } from '@/common/types/network';
import { forwardRef } from '@chakra-ui/react';
import Link, { LinkProps } from 'next/link';
import React, { PropsWithChildren } from 'react';

export const buildUrl = (href: LinkProps['href'], network: Network): string => {
  const url = `${href}?chain=${encodeURIComponent(network?.mode)}`;
  if (network?.isCustomNetwork) {
    return `${url}&api=${network.url}`;
  }
  return url;
};

export const ExplorerLink = forwardRef<LinkProps, 'a'>(({ href, ...rest }, ref) => {
  const network = useGlobalContext().activeNetwork;
  return <Link ref={ref} legacyBehavior href={buildUrl(href, network)} passHref {...rest} />;
});

export const TxLink: React.FC<PropsWithChildren<{ txid: string }>> = React.memo(
  ({ txid, ...rest }) => {
    return <ExplorerLink href={`/txid/${encodeURIComponent(txid)}`} {...rest} />;
  }
);

export const MicroblockLink: React.FC<PropsWithChildren<{ hash: string }>> = React.memo(
  ({ hash, ...rest }) => {
    return <ExplorerLink href={`/microblock/${encodeURIComponent(hash)}`} {...rest} />;
  }
);

export const BlockLink: React.FC<PropsWithChildren<{ hash: string }>> = React.memo(
  ({ hash, ...rest }) => {
    return <ExplorerLink href={`/block/${encodeURIComponent(hash)}`} {...rest} />;
  }
);

export const AddressLink: React.FC<PropsWithChildren<{ principal: string }>> = React.memo(
  ({ principal, ...rest }) => {
    return principal.includes('.') ? (
      <TxLink txid={principal} {...rest} />
    ) : (
      <ExplorerLink href={`/address/${encodeURIComponent(principal)}`} {...rest} />
    );
  }
);
