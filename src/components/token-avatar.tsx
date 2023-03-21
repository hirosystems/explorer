import { getAssetNameParts } from '@/common/utils';
import { imageCanonicalUriFromFtMetadata } from '@/common/utils/token-utils';
import { Circle } from '@/ui/components';
import React from 'react';

import { FungibleTokenMetadata, NonFungibleTokenMetadata } from '@stacks/blockchain-api-client';

interface TokenAvatarProps {
  token: string;
  tokenMetadata?: FungibleTokenMetadata | NonFungibleTokenMetadata;
}

export function TokenAvatar({ token, tokenMetadata }: TokenAvatarProps) {
  const { asset } = getAssetNameParts(token);
  const imageCanonicalUri = imageCanonicalUriFromFtMetadata(tokenMetadata);
  return imageCanonicalUri ? (
    <TokenImage imageUri={imageCanonicalUri} />
  ) : (
    <DefaultTokenImage asset={asset} />
  );
}

interface TokenImageProps {
  imageUri: string;
}

const TokenImage = ({ imageUri }: TokenImageProps) => {
  return (
    <img
      width={'36px'}
      height={'36px'}
      src={encodeURI(imageUri)}
      style={{ marginRight: '16px' }}
      alt="token-image"
    />
  );
};

interface DefaultTokenImageProps {
  asset: string;
}

function DefaultTokenImage({ asset }: DefaultTokenImageProps) {
  return (
    <Circle size="36px" mr="16px">
      {asset[0].toUpperCase()}
    </Circle>
  );
}
