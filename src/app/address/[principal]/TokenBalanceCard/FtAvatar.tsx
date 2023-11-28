'use client';

import React from 'react';

import { useFtMetadata } from '../../../../common/queries/useFtMetadata';
import { getAssetNameParts } from '../../../../common/utils/utils';
import { TokenAvatar } from './TokenAvatar';
import { useImageUrl } from './useImageUrl';

interface FtAvatarProps {
  asset: string;
  token: string;
  contractId: string;
}

export function FtAvatar({ token, contractId }: FtAvatarProps) {
  const { data: tokenMetadata } = useFtMetadata(contractId);
  const { asset } = getAssetNameParts(token);
  const { url, contentType } = useImageUrl(tokenMetadata);
  return <TokenAvatar contentType={contentType} url={url} asset={asset} />;
}
