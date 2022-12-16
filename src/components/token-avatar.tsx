import React from 'react';

import { FungibleTokenMetadata, NonFungibleTokenMetadata } from '@stacks/blockchain-api-client';
import { DynamicColorCircle } from '@stacks/ui';

import { getAssetNameParts } from '@common/utils';
import { imageCanonicalUriFromFtMetadata } from '@common/utils/token-utils';

interface TokenAvatarProps {
  token: string;
  tokenMetadata?: FungibleTokenMetadata | NonFungibleTokenMetadata;
}

export function TokenAvatar({ token, tokenMetadata }: TokenAvatarProps) {
  const { address, asset, contract } = getAssetNameParts(token);
  const imageCanonicalUri = imageCanonicalUriFromFtMetadata(tokenMetadata);
  return imageCanonicalUri ? (
    <TokenImage imageUri={imageCanonicalUri} />
  ) : (
    <DefaultTokenImage address={address} contract={contract} asset={asset} />
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
  address: string;
  contract: string;
  asset: string;
}

function DefaultTokenImage({ address, contract, asset }: DefaultTokenImageProps) {
  return (
    <DynamicColorCircle size="32px" mr="base" string={`${address}.${contract}::${asset}`}>
      {asset[0]}
    </DynamicColorCircle>
  );
}
