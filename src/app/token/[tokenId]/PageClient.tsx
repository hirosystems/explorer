'use client';

import { Sip10Disclaimer } from '../../../common/components/Sip10Disclaimer';
import { Flex } from '../../../ui/Flex';
import { Tag } from '../../../ui/Tag';
import { TagLabel } from '../../../ui/TagLabel';
import { PageTitle, PageTitleWithTags } from '../../_components/PageTitle';
import { Tabs } from './Tabs';
import { TokenInfo } from './TokenInfo';
import { TokenInfoProps } from './types';

export default function PageClient({
  tokenId,
  tokenInfo,
}: {
  tokenId: string;
  tokenInfo: TokenInfoProps;
}) {
  if (!tokenInfo.basic) throw new Error('Could not find token info');
  const { name, symbol } = tokenInfo.basic;
  const categories = tokenInfo.extended?.categories || [];

  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        {!!categories.length ? (
          <PageTitleWithTags
            tags={categories.map(category => (
              <Tag key={category}>
                <TagLabel>{category}</TagLabel>
              </Tag>
            ))}
          >
            {name} ({symbol})
          </PageTitleWithTags>
        ) : (
          <PageTitle>
            {name} ({symbol})
          </PageTitle>
        )}
        {/*{!!tokenInfo.extended?.links && <LinksMenu links={tokenInfo.extended.links} />}*/}
      </Flex>
      <TokenInfo tokenInfo={tokenInfo} txId={tokenId} />
      <Tabs
        tokenId={tokenId}
        developerData={
          !!tokenInfo.extended?.links?.repos?.length ? tokenInfo.extended?.developerData : undefined
        }
        tokenInfo={tokenInfo}
      />
      <Sip10Disclaimer />
    </>
  );
}
