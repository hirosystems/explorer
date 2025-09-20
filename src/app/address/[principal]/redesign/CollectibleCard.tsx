'use client';

import { TokenLink } from '@/common/components/ExplorerLinks';
import { useNftMetadata } from '@/common/queries/useNftMetadata';
import { deriveTokenTickerFromAssetId } from '@/common/utils/fungible-token-utils';
import { getAssetNameParts } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';

import { useImageContentType } from '../TokenBalanceCard/useImageUrl';
import { TokenImage } from './TokenImage';

const COLLECTIBLE_CARD_HEIGHT = 136;
const COLLECTIBLE_CARD_WIDTH = 136;

const DefaultTokenImage = ({
  asset,
  height,
  width,
}: {
  asset: string;
  height: number;
  width: number;
}) => {
  return (
    <Flex
      h={height}
      w={width}
      alignItems="center"
      justifyContent="center"
      bg="surfacePrimary"
      borderRadius="redesign.xl"
    >
      <Text textStyle="text-regular-sm" color="textPrimary" fontFamily="matterMono">
        {asset[0].toUpperCase()}
      </Text>
    </Flex>
  );
};

export function CollectibleCard({
  assetId,
  tokenId,
}: {
  assetId: string;
  tokenId?: bigint | undefined;
}) {
  const { address, contract, asset } = getAssetNameParts(assetId);
  const contractId = `${address}.${contract}`;

  const { data: tokenMetadata } = useNftMetadata(
    { contractId, tokenId: Number(tokenId) },
    { enabled: !!tokenId, retry: 1, retryDelay: 2000 }
  );

  const { url, contentType } = useImageContentType(tokenMetadata?.metadata?.cached_image);

  const nftImage = url ? (
    <TokenImage
      url={url}
      alt={asset}
      height={COLLECTIBLE_CARD_HEIGHT}
      width={COLLECTIBLE_CARD_WIDTH}
      addGlow
    ></TokenImage>
  ) : (
    <DefaultTokenImage
      asset={asset}
      height={COLLECTIBLE_CARD_HEIGHT}
      width={COLLECTIBLE_CARD_WIDTH}
    />
  );

  const ticker = deriveTokenTickerFromAssetId(asset);

  console.log('CollectibleCard', { asset, contractId, tokenId, tokenMetadata });
  return (
    <Stack
      px={3}
      pt={3}
      pb={4}
      gap={3}
      border="1px solid"
      borderColor="redesignBorderSecondary"
      borderRadius="redesign.xl"
      w="fit-content"
    >
      {nftImage}
      <TokenLink tokenId={contractId} textStyle="text-regular-sm" color="textPrimary">
        {asset}
      </TokenLink>
      <Text textStyle="text-regular-sm" color="textSecondary">
        {ticker}
      </Text>
    </Stack>
  );
}
