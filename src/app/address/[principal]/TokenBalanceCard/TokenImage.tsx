'use client';

import React, { useState } from 'react';

import { DefaultTokenImage } from './DefaultTokenImage';

export const TokenImage = ({ url, alt }: { url: string; alt: string }) => {
  const [imageUrl, setImageUrl] = useState<string>(encodeURI(decodeURI(url)));
  const [badImage, setBadImage] = useState<boolean>(false);
  const fallbackImageUrl = imageUrl.replace(
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/'
  );
  if (badImage) {
    return <DefaultTokenImage asset={alt} />;
  }
  return (
    <img
      width={36}
      height={36}
      src={imageUrl}
      onError={e => {
        if (imageUrl !== fallbackImageUrl) {
          setImageUrl(fallbackImageUrl);
        } else {
          setBadImage(true);
        }
      }}
      style={{ marginRight: '16px' }}
      alt={alt}
    />
  );
};
