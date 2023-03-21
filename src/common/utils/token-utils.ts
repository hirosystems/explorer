import { convertUnicodeToAscii } from './string-utils';
import { isIconUrl } from './url-utils';
import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';

export function isFtNameLikeStx(name?: string): boolean {
  return (
    !!name && ['stx', 'stack', 'stacks'].includes(convertUnicodeToAscii(name).toLocaleLowerCase())
  );
}

export function imageCanonicalUriFromFtMetadata(meta?: FtMetadataResponse): string | undefined {
  return meta?.image_canonical_uri &&
    isIconUrl(meta.image_canonical_uri) &&
    !isFtNameLikeStx(meta.name)
    ? meta.image_canonical_uri
    : undefined;
}
