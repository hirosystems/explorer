import { FungibleTokenMetadata, NonFungibleTokenMetadata } from '@stacks/blockchain-api-client';

import { convertUnicodeToAscii } from './string-utils';
import { isIconUrl } from './url-utils';

export function isFtNameLikeStx(name: string): boolean {
  return ['stx', 'stack', 'stacks'].includes(convertUnicodeToAscii(name).toLocaleLowerCase());
}

export function imageCanonicalUriFromFtMetadata(
  meta?: FungibleTokenMetadata | NonFungibleTokenMetadata
): string | undefined {
  return meta?.image_canonical_uri &&
    isIconUrl(meta.image_canonical_uri) &&
    !isFtNameLikeStx(meta.name)
    ? meta.image_canonical_uri
    : undefined;
}
