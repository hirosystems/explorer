'use client';

import { forwardRef } from 'react';

import { Link, LinkProps } from '../../ui/Link';
import { useGlobalContext } from '../context/useGlobalContext';
import { buildUrl } from '../utils/buildUrl';

export const ExplorerLink = forwardRef<'a', LinkProps & { openInNewTab?: boolean }>(
  ({ href, openInNewTab, ...rest }, ref) => {
    const network = useGlobalContext().activeNetwork;
    return (
      <Link
        ref={ref}
        href={buildUrl(href!, network)}
        {...(openInNewTab && { target: '_blank' })}
        {...rest}
      />
    );
  }
);

export const TxLink = forwardRef<
  'a',
  Partial<LinkProps> & { txId: string; openInNewTab?: boolean }
>(({ txId, openInNewTab = false, ...rest }, ref) => {
  return (
    <ExplorerLink
      ref={ref}
      href={`/txid/${encodeURIComponent(txId)}`}
      openInNewTab={openInNewTab}
      {...rest}
    />
  );
});

export const TokenLink = forwardRef<'a', Partial<LinkProps> & { tokenId: string }>(
  ({ tokenId, ...rest }, ref) => {
    return <ExplorerLink ref={ref} href={`/token/${encodeURIComponent(tokenId)}`} {...rest} />;
  }
);

export const MicroBlockLink = forwardRef<'a', Partial<LinkProps> & { hash: string }>(
  ({ hash, ...rest }, ref) => {
    return <ExplorerLink ref={ref} href={`/microblock/${encodeURIComponent(hash)}`} {...rest} />;
  }
);

export const BlockLink = forwardRef<'a', Partial<LinkProps> & { hash: string }>(
  ({ hash, ...rest }, ref) => {
    return <ExplorerLink ref={ref} href={`/block/${encodeURIComponent(hash)}`} {...rest} />;
  }
);

export const AddressLink = forwardRef<'a', Partial<LinkProps> & { principal: string }>(
  ({ principal, ...rest }, ref) => {
    return principal.includes('.') ? (
      <TxLink ref={ref} txId={principal} {...rest} />
    ) : (
      <ExplorerLink ref={ref} href={`/address/${encodeURIComponent(principal)}`} {...rest} />
    );
  }
);
