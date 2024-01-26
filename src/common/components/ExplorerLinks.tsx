'use client';

import { forwardRef } from '@chakra-ui/react';

import { Link, LinkProps } from '../../ui/Link';
import { useGlobalContext } from '../context/useAppContext';
import { buildUrl } from '../utils/buildUrl';

export const ExplorerLink = forwardRef<LinkProps & { openInNewTab?: boolean }, 'a'>(
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
  Partial<LinkProps> & { txId: string; openInNewTab?: boolean },
  'a'
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

export const TokenLink = forwardRef<Partial<LinkProps> & { tokenId: string }, 'a'>(
  ({ tokenId, ...rest }, ref) => {
    return <ExplorerLink ref={ref} href={`/token/${encodeURIComponent(tokenId)}`} {...rest} />;
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
