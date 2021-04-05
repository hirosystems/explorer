import React from 'react';
import Head from 'next/head';
import { useSafeLayoutEffect } from '@stacks/ui';

import { useMediaQuery } from '@common/hooks/use-media-query';
import { Statuses } from '@components/status';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';

const defaultTitle = 'Stacks 2.0 explorer';

interface MetaProps {
  title?: string;
  ogTitle?: string;
  url?: string;
  description?: string;
  labels?: { label: string; data: string }[];
  status?: Transaction['tx_status'] | MempoolTransaction['tx_status'];
}

const useFaviconName = (s?: Transaction['tx_status'] | MempoolTransaction['tx_status']) => {
  const status = () => {
    switch (s) {
      case 'abort_by_post_condition':
      case 'abort_by_response':
        return 'failed';
      default:
        return s;
    }
  };
  return `favicon${status() ? `-${status()}` : ''}`;
};

export const Meta = ({
  title = defaultTitle,
  status,
  description = 'Explore transactions and accounts on the Stacks blockchain. Clone any contract and experiment in your browser with the Explorer sandbox.',
  ogTitle,
  url,
  labels,
}: MetaProps) => {
  const filename = useFaviconName(status);
  const mode = useNetworkMode();

  const withMode = (title: string) => {
    if (mode === 'testnet') {
      return `${title} [Testnet mode]`;
    }
    return title;
  };

  return (
    <Head>
      <title>{withMode(title === defaultTitle ? title : `${title} - ${defaultTitle}`)}</title>
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="explorer.stacks.co" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@stacks" />
      <meta name="twitter:creator" content="@stacks" />
      <meta
        property="og:image"
        content={`https://blockstack-www.imgix.net/stacks-explorer-og.png?auto=format,compress`}
      />
      <meta
        name="twitter:image"
        content={`https://blockstack-www.imgix.net/stacks-explorer-og.png?auto=format,compress`}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@stacks" />
      <meta property="og:title" content={ogTitle || title} />
      {url ? <meta property="og:url" content={url} /> : null}
      <meta property="og:description" content={description} />
      {labels?.length
        ? labels.map(({ label, data }, key) => (
            <React.Fragment key={key}>
              <meta
                name={`twitter:label${key + 1}`}
                // @ts-ignore
                content={label}
              />
              <meta
                name={`twitter:data${key + 1}`}
                // @ts-ignore
                content={data}
              />
            </React.Fragment>
          ))
        : null}
      <link rel="icon" type="image/svg+xml" href={`/static/${filename}.png`} />
    </Head>
  );
};
