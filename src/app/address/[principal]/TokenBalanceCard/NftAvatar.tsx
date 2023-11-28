'use client';

import React from 'react';

import { useNftMetadata } from '../../../../common/queries/useNftMetadata';
import { TokenAvatar } from './TokenAvatar';
import { useImageUrl } from './useImageUrl';

interface NftAvatarProps {
  asset: string;
  token: string;
  contractId: string;
  firstNftValue?: bigint;
}

export function NftAvatar({ token, contractId, firstNftValue, asset }: NftAvatarProps) {
  const { data: tokenMetadata } = useNftMetadata(
    { contractId, tokenId: Number(firstNftValue) },
    { enabled: !!firstNftValue, retry: 1, retryDelay: 2000 }
  );
  const { url, contentType } = useImageUrl(tokenMetadata);
  return <TokenAvatar contentType={contentType} url={url} asset={asset} />;
}
