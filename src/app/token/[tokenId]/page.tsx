import { Flex } from '@/ui/components';
import { Title } from '@/ui/typography';
import { TokenInfo } from './TokenInfo';
import { TokenInfoProps } from '@/pages/token/[tokenId]';
import { useRouter } from 'next/router';
import { StyledBadge } from '@/components/status';
import { Stack } from '@/ui/Stack';
import { Tabs } from './Tabs';
import React from 'react';
import { LinksMenu } from '@/app/token/[tokenId]/LinksMenu';

function TokenPage({ tokenId, tokenInfo }: { tokenId: string; tokenInfo: TokenInfoProps }) {
  if (!tokenInfo.basic) throw new Error('Could not find token info');

  const { name, symbol } = tokenInfo.basic;
  const categories = tokenInfo.extended?.categories || [];

  const { query } = useRouter();

  return (
    <Flex mt="72px" gap="24px" width="100%" direction={'column'}>
      <Stack gap={'16px'}>
        <Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
          <Title
            as="h1"
            fontSize="36px"
            display="block"
            width="100%"
            textAlign={['center', 'left']}
            data-test="homepage-title"
            color="white"
            gridColumnStart={'1'}
            gridColumnEnd={['2', '2', '3']}
          >
            {name} ({symbol})
          </Title>
          {!!tokenInfo.extended?.links && <LinksMenu links={tokenInfo.extended.links} />}
        </Flex>
        {!!categories.length && (
          <Stack isInline spacing="8px" mt={'0px !important'}>
            {categories.map(category => (
              <StyledBadge>{category}</StyledBadge>
            ))}
          </Stack>
        )}
      </Stack>
      <TokenInfo tokenInfo={tokenInfo} txId={query.tokenId as string} />
      <Tabs
        tokenId={tokenId}
        developerData={
          !!tokenInfo.extended?.links?.repos?.length ? tokenInfo.extended?.developerData : undefined
        }
      />
    </Flex>
  );
}

export default TokenPage;
