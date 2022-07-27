import { CollectibleLink } from '@components/links';
import { Section } from '@components/section';
import { Link } from '@components/typography';
import { Box, Flex, Stack } from '@stacks/ui';
import * as React from 'react';

export const CollectibleList = ({ principal }) => {
  // const imageUrl = 'https://placehold.co/225';
  const imageUrl =
    'https://ipfs.io/ipfs/QmZjrCc9836Njqw1Yx8ztM6FbJzvuZijwtZJSkKPxLTMWU/34b424ea4b724';
  const arr = new Array(5).fill(0);
  return (
    <Flex spacing="base" style={{ overflow: 'hidden' }}>
      {arr.map(_ => (
        <CollectibleCard imageUrl={imageUrl} />
      ))}
    </Flex>
  );
};

export const CollectibleCard = ({ imageUrl }) => {
  return (
    <Stack spacing="base" p="base">
      <img src={imageUrl} style={{ maxWidth: '100%' }} />
    </Stack>
  );
};

export const TopRight = ({ principal }) => {
  return <a href={`/collectibles/${principal}`} />;
};

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
