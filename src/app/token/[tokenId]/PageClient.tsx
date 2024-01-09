'use client';

import React from 'react';

import { StyledBadge } from '../../../common/components/status';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { getTxTitle } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { Tag } from '../../../ui/Tag';
import { TagLabel } from '../../../ui/TagLabel';
import { TagLeftIcon } from '../../../ui/TagLeftIcon';
import { StxIcon } from '../../../ui/icons';
import { PageTitle, PageTitleWithTags } from '../../_components/PageTitle';
import { LinksMenu } from './LinksMenu';
import { Tabs } from './Tabs';
import { TokenInfo } from './TokenInfo';
import Skeleton from './skeleton';
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
        {!!tokenInfo.extended?.links && <LinksMenu links={tokenInfo.extended.links} />}
      </Flex>
      <TokenInfo tokenInfo={tokenInfo} txId={tokenId} />
      <Tabs
        tokenId={tokenId}
        developerData={
          !!tokenInfo.extended?.links?.repos?.length ? tokenInfo.extended?.developerData : undefined
        }
      />
    </>
  );
}
