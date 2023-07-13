import { buildUrl } from '@/app/common/utils/buildUrl';
import { useGlobalContext } from '@/common/context/useAppContext';
import { Network } from '@/common/types/network';
import { forwardRef } from '@chakra-ui/react';
import Link, { LinkProps } from 'next/link';
import React from 'react';

export const ExplorerLink = forwardRef<LinkProps, 'a'>(({ href, ...rest }, ref) => {
  const network = useGlobalContext().activeNetwork;
  return <Link ref={ref} legacyBehavior href={buildUrl(href, network)} passHref {...rest} />;
});

export const TxLink = forwardRef<Partial<LinkProps> & { txId: string }, 'a'>(
  ({ txId, ...rest }, ref) => {
    return <ExplorerLink ref={ref} href={`/txid/${encodeURIComponent(txId)}`} {...rest} />;
  }
);

export const MicroBlockLink = forwardRef<Partial<LinkProps> & { hash: string }, 'a'>(
  ({ hash, ...rest }, ref) => {
    return <ExplorerLink ref={ref} href={`/microblock/${encodeURIComponent(hash)}`} {...rest} />;
  }
);

export const BlockLink = forwardRef<Partial<LinkProps> & { hash: string }, 'a'>(
  ({ hash, ...rest }, ref) => {
    return <ExplorerLink ref={ref} href={`/block/${encodeURIComponent(hash)}`} {...rest} />;
  }
);

export const AddressLink = forwardRef<Partial<LinkProps> & { principal: string }, 'a'>(
  ({ principal, ...rest }, ref) => {
    return principal.includes('.') ? (
      <TxLink ref={ref} txId={principal} {...rest} />
    ) : (
      <ExplorerLink ref={ref} href={`/address/${encodeURIComponent(principal)}`} {...rest} />
    );
  }
);
