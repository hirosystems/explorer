import React from 'react';
import Head from 'next/head';
import { useSafeLayoutEffect } from '@blockstack/ui';

import { useMediaQuery } from '@common/hooks/use-media-query';
import { Statuses } from '@components/status';

const defaultTitle = 'Stacks 2.0 explorer';

interface MetaProps {
  title?: string;
  ogTitle?: string;
  url?: string;
  description?: string;
  labels?: { label: string; data: string }[];
  status?: Statuses | '';
}

const useFaviconName = (s?: string) => {
  const [status, setStaus] = React.useState(s);
  const [darkmode] = useMediaQuery('(prefers-color-scheme: dark)');
  useSafeLayoutEffect(() => {
    setStaus(s);
  }, [s]);
  return `favicon-${darkmode ? 'light' : 'dark'}${status ? '-' + status : ''}`;
};

export const Meta = ({
  title = defaultTitle,
  status,
  description,
  ogTitle,
  url,
  labels,
}: MetaProps) => {
  const filename = useFaviconName(status);
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Stacks 2.0 blockchain explorer" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@blockstack" />
      <meta name="twitter:creator" content="@blockstack" />
      {ogTitle ? <meta property="og:title" content={ogTitle} /> : null}
      {url ? <meta property="og:url" content={url} /> : null}
      {url ? <meta property="og:description" content={description} /> : null}
      {labels?.length
        ? labels.map(({ label, data }, key) => (
            <>
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
            </>
          ))
        : null}
      <link rel="icon" type="image/svg+xml" href={`/${filename}.svg`} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    </Head>
  );
};
