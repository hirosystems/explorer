'use client';

import React from 'react';

import { DefaultTokenImage } from './DefaultTokenImage';
import { TokenImage } from './TokenImage';
import { TokenVideo } from './TokenVideo';

export function TokenAvatar({
  contentType,
  url,
  asset,
}: {
  contentType: string | null;
  url?: string;
  asset: string;
}) {
  if (!url) return <DefaultTokenImage asset={asset} />;
  if (contentType?.startsWith('video')) {
    return <TokenVideo url={url} />;
  }
  return <TokenImage url={url} alt={asset} />;
}
