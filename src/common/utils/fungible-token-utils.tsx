import { RISKY_TOKENS, VERIFIED_TOKENS } from '@/app/token/[tokenId]/consts';
import { Metadata } from '@hirosystems/token-metadata-api-client';

export const deriveTokenTickerFromAssetId = (assetId: string) => {
  const ticker = assetId.toUpperCase();
  if (ticker.includes('-')) {
    const parts = ticker.split('-');
    if (parts.length >= 3) {
      return `${parts[0][0]}${parts[1][0]}${parts[2][0]}`;
    } else {
      return `${parts[0][0]}${parts[1][0]}${parts[1][1]}`;
    }
  }
  if (ticker.length >= 3) {
    return `${ticker[0]}${ticker[1]}${ticker[2]}`;
  }
  return ticker;
};

export function isVerifiedToken(tokenAddress: string) {
  return VERIFIED_TOKENS.includes(tokenAddress);
}

export function isRiskyToken(tokenAddress: string) {
  return RISKY_TOKENS.includes(tokenAddress);
}

export function getTokenImageUrlFromTokenMetadata(tokenMetadata: Metadata) {
  const cachedThumbnailImage =
    'cached_thumbnail_image' in tokenMetadata ? tokenMetadata.cached_thumbnail_image : undefined;
  const cachedImage = 'cached_image' in tokenMetadata ? tokenMetadata.cached_image : undefined;
  const image = 'image' in tokenMetadata ? tokenMetadata.image : undefined;
  return cachedThumbnailImage || cachedImage || image;
}

export function calculateHoldingPercentage(
  balance: string,
  totalSupply: string | undefined
): string {
  if (!totalSupply) return '-';

  const percentage = (parseFloat(balance) / parseFloat(totalSupply)) * 100;
  return percentage < 0.0001 && percentage > 0 ? '<0.0001%' : `${percentage.toFixed(4)}%`;
}
