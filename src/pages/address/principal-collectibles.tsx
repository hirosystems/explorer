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

export const CollectibleList = ({ principal }) => {
  // const imageUrl = 'https://placehold.co/225';
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
      item => item.event_type === 'non_fungible_token_asset' && item.asset.recipient === principal
    );
    console.log('accountNfts', accountNfts);
    console.log('principalCollectibles', principalCollectibles(accountNfts, nftMetadata));
    setPrincipalAssets(principalCollectibles(accountNfts, nftMetadata));
  }, [accountAssets, nftMetadata]);

  const imageUrl =
    'https://ipfs.io/ipfs/QmZjrCc9836Njqw1Yx8ztM6FbJzvuZijwtZJSkKPxLTMWU/34b424ea4b724';
  // const arr = new Array(5).fill(0);
  return (
    <Flex spacing="base" style={{ overflow: 'hidden', justifyContent: 'space-between' }}>
      {principalAssets.map(asset => (
        <CollectibleCard imageUrl={imageUrl} asset={asset} />
      ))}
    </Flex>
  );
};

export const CollectibleCard = ({ asset }) => {
  console.log('asset', asset);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const { data: metadata } = useQuery([asset.metadataUrl], () =>
    fetch(asset.metadataUrl).then(res => res.json())
  );

  useEffect(() => {
    if (!metadata) return;
    console.log('setting', metadata.image);
    setImageUrl(ipfsToIpfsIo(metadata.image));
  }, metadata);
  console.log('assmeta', metadata);
  if (!imageUrl) return null;
  return (
    <Stack spacing="base" p="base">
      <img src={imageUrl} style={{ maxWidth: '225px' }} />
    </Stack>
  );
};

export const TopRight = ({ principal }) => {
  return <a href={`/collectibles/${principal}`} />;
};

function urlFromTokenId(url, tokenId) {
  return url.replace('{id}', tokenId);
}

function assetIdToContractId(assetId) {
  return assetId.split('::')[0];
}

function principalCollectibles(accountNfts, nftMetadata) {
  if (!accountNfts || !nftMetadata) return [];
  const result = accountNfts
    .filter(nft => {
      return assetIdToContractId(nft.asset.asset_id) in nftMetadata;
    })
    .map(nft => {
      return {
        ...nft,
        metadataUrl: urlFromTokenId(
          nftMetadata[assetIdToContractId(nft.asset.asset_id)].ipfsUrl,
          nft.asset.value.repr.replace('u', '')
        ),
      };
    });
  return result;
}

export const PrincipalCollectible = ({ principal }) => {
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
