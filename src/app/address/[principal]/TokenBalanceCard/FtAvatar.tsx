'use client';

import React from 'react';

import { useFtMetadata } from '../../../../common/queries/useFtMetadata';
import { getAssetNameParts } from '../../../../common/utils/utils';
import { TokenAvatar } from './TokenAvatar';

interface FtAvatarProps {
  token: string;
  contractId: string;
}

export function FtAvatar({ token, contractId }: FtAvatarProps) {
  const { data: tokenMetadata } = useFtMetadata(contractId);

  const { asset } = getAssetNameParts(token);
  return <TokenAvatar metadataImageUrl={tokenMetadata?.metadata?.cached_image} asset={asset} />;
}
