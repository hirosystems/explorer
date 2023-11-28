'use client';

import React from 'react';

import { StyledBadge } from '../../../common/components/status';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { PageTitle } from '../../_components/PageTitle';
import { LinksMenu } from './LinksMenu';
import { Tabs } from './Tabs';
import { TokenInfo } from './TokenInfo';
import { TokenInfoProps } from './types';

export function TokenPage({ tokenId, tokenInfo }: { tokenId: string; tokenInfo: TokenInfoProps }) {
  if (!tokenInfo.basic) throw new Error('Could not find token info');

  const { name, symbol } = tokenInfo.basic;
  const categories = tokenInfo.extended?.categories || [];

  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <Flex direction={'column'} gap={'8px'} width={'100%'}>
        {!!categories.length && (
          <HStack gap="8px">
            {categories.map(category => (
              <StyledBadge>{category}</StyledBadge>
            ))}
          </HStack>
        )}
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          width={'100%'}
          mt={!!categories.length ? '8px' : '40px'}
        >
          <PageTitle mt={'0px'}>
            {name} ({symbol})
          </PageTitle>
          {!!tokenInfo.extended?.links && <LinksMenu links={tokenInfo.extended.links} />}
        </Flex>
      </Flex>
      <TokenInfo tokenInfo={tokenInfo} txId={tokenId} />
      <Tabs
        tokenId={tokenId}
        developerData={
          !!tokenInfo.extended?.links?.repos?.length ? tokenInfo.extended?.developerData : undefined
        }
      />
    </Flex>
  );
}
