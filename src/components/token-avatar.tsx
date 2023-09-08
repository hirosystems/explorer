import { getAssetNameParts } from '@/common/utils';
import { imageCanonicalUriFromFtMetadata } from '@/common/utils/token-utils';
import { Circle } from '@/ui/components';
import { FtMetadataResponse, NftMetadataResponse } from '@hirosystems/token-metadata-api-client';
import React, { useEffect, useState } from 'react';

export function FtAvatar({
  token,
  tokenMetadata,
}: {
  token: string;
  tokenMetadata?: FtMetadataResponse;
}) {
  const { asset } = getAssetNameParts(token);
  const imageCanonicalUri = imageCanonicalUriFromFtMetadata(tokenMetadata);
  return imageCanonicalUri ? (
    <TokenImage url={imageCanonicalUri} alt={asset} />
  ) : (
    <DefaultTokenImage asset={asset} />
  );
}

export function NftAvatar({
  token,
  tokenMetadata,
}: {
  token: string;
  tokenMetadata?: NftMetadataResponse;
}) {
  const { asset } = getAssetNameParts(token);
  const url = tokenMetadata?.metadata?.cached_image;
  const [contentType, setContentType] = useState<string | null>('image');
  useEffect(() => {
    if (!url) return;
    void fetch(url)
      .then(response => {
        setContentType(response.headers.get('content-type'));
      })
      .catch(() => {
        // corrupted image
        setContentType(null);
      });
  }, [url]);
  return url && contentType ? (
    contentType?.startsWith('video') ? (
      <TokenVideo url={url} />
    ) : (
      <TokenImage url={url} alt={asset} />
    )
  ) : (
    <DefaultTokenImage asset={asset} />
  );
}

interface TokenImageProps {
  url: string;
  alt: string;
}

const TokenImage = ({ url, alt }: TokenImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>(encodeURI(decodeURI(url)));
  const fallbackImageUrl = imageUrl.replace(
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/'
  );
  return (
    <img
      width={'36px'}
      height={'36px'}
      src={imageUrl}
      onError={e => {
        if (imageUrl !== fallbackImageUrl) {
          setImageUrl(fallbackImageUrl);
        }
      }}
      style={{ marginRight: '16px' }}
      alt={alt}
    />
  );
};

interface TokenVideoProps {
  url: string;
}

const TokenVideo = ({ url }: TokenVideoProps) => {
  return (
    <video width={'36px'} height={'36px'} src={encodeURI(url)} style={{ marginRight: '16px' }} />
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
