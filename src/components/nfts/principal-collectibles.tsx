import { fetchFromSidecar } from '@common/api/fetch';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { CollectibleLink } from '@components/links';
import { Section } from '@components/section';
import { Link } from '@components/typography';
import { addressQK, AddressQueryKeys } from '@features/address/query-keys';
import { useAddressQueries } from '@features/address/use-address-queries';
import { ipfsToIpfsIo } from '@pages/api/nfts';
import { Box, Flex, Stack } from '@stacks/ui';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { css } from '@emotion/react';

export const CollectibleList = ({ principal }: { principal: string }) => {
  const [principalAssets, setPrincipalAssets] = React.useState([]);

  const { data: nftMetadata } = useQuery(['nftMetadata'], () =>
    fetch('/api/nfts?chain=mainnet').then(res => res.json())
  );
  console.log('meta', nftMetadata);

  const queries = useAddressQueries();
  const { data: accountAssets } = useQuery(
    addressQK(AddressQueryKeys.accountAssets, principal),
    queries.getAccountAssets(principal)
  );

  console.log('accountAssets', accountAssets);
  useEffect(() => {
    if (!accountAssets) return;
    if (!nftMetadata) return;
    const accountNfts = accountAssets?.results?.filter(
      // @ts-ignore
      item => item.event_type === 'non_fungible_token_asset' && item.asset.recipient === principal
    );
    console.log('accountNfts', accountNfts);
    console.log('principalCollectibles', principalCollectibles(accountNfts, nftMetadata));
    // @ts-ignore
    setPrincipalAssets(principalCollectibles(accountNfts, nftMetadata));
  }, [accountAssets, nftMetadata]);

  if (!principalAssets?.length) return null;

  return (
    <Flex
      spacing="base"
      css={css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(161px, 1fr));
        grid-gap: 0.25rem;
        padding: 32px;
      `}
    >
      {principalAssets.map(asset => (
        <CollectibleCard asset={asset} />
      ))}
    </Flex>
  );
};

export const CollectibleCard = ({ asset }: any) => {
  console.log('asset', asset);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const { data: metadata } = useQuery([asset.metadataUrl], () =>
    fetch(asset.metadataUrl).then(res => res.json())
  );

  useEffect(() => {
    if (!metadata) return;
    console.log('setting', metadata.image);
    setImageUrl(ipfsToIpfsIo(metadata.image || metadata.imageUrl));
  }, metadata);
  console.log('assmeta', metadata);
  if (!imageUrl) return null;
  return (
    <Stack spacing="base">
      <img src={imageUrl} style={{ maxWidth: '161px', borderRadius: '3px' }} />
    </Stack>
  );
};

export const TopRight = ({ principal }: { principal: string }) => {
  return <a href={`/collectibles/${principal}`} />;
};

function urlFromTokenId(url: string, tokenId: string) {
  return url.replace('{id}', tokenId);
}

function assetIdToContractId(assetId: string) {
  return assetId.split('::')[0];
}

function principalCollectibles(accountNfts: any[], nftMetadata: any[]) {
  if (!accountNfts || !nftMetadata) return [];
  console.log('foo');
  const result = accountNfts
    .filter(nft => {
      return assetIdToContractId(nft.asset.asset_id) in nftMetadata;
    })
    .map(nft => {
      return {
        ...nft,
        metadataUrl: urlFromTokenId(
          nftMetadata[assetIdToContractId(nft.asset.asset_id) as any].ipfsUrl,
          nft.asset.value.repr.replace('u', '')
        ),
      };
    });
  return result;
}

export const PrincipalCollectible = ({ principal }: { principal: string }) => {
  return (
    <Section
      mb={'extra-loose'}
      title="Collectibles"
      topRight={() => (
        <Flex as="a" target="_blank" alignItems="center">
          <CollectibleLink principal={principal}>
            <Link display="inline-block" as="a">
              View All
            </Link>
          </CollectibleLink>
        </Flex>
      )}
      // topRight={() => <TopRight principal={principal} />}
    >
      <Stack spacing="loose">
        <CollectibleList principal={principal} />
      </Stack>
    </Section>
  );
};
