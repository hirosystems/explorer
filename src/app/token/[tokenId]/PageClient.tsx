'use client';

import { getHasSBTCInName, getIsSBTC } from '@/app/tokens/utils';
import { Box, Icon, Image, Link, Stack, Text } from '@chakra-ui/react';
import { SealCheck, Warning } from '@phosphor-icons/react';

import { Sip10Disclaimer } from '../../../common/components/Sip10Disclaimer';
import { Flex } from '../../../ui/Flex';
import { Tag } from '../../../ui/Tag';
import { TagLabel } from '../../../ui/TagLabel';
import { PageTitle } from '../../_components/PageTitle';
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
  const { name, symbol, imageUri } = tokenInfo.basic;
  const categories = tokenInfo.extended?.categories || [];
  const hasSBTCInName = getHasSBTCInName(name ?? '', symbol ?? '');
  const isSBTC = getIsSBTC(tokenId);
  return (
    <>
      <Stack gap={2}>
        {!!categories.length && (
          <Flex gap={2}>
            {categories.map(category => (
              <Tag key={category}>
                <TagLabel>{category}</TagLabel>
              </Tag>
            ))}
          </Flex>
        )}
        <Flex alignItems={'center'} gap={2} flexWrap="wrap">
          <Image src={imageUri} alt={name ?? ''} h={10} w={10} />
          <PageTitle>
            {name} ({symbol})
          </PageTitle>
          {isSBTC && (
            <Tag
              color="green.600"
              bg="green.300"
              border="1px solid var(--stacks-colors-green-500)"
              pt={1}
              py={2.5}
            >
              <Flex alignItems={'center'} gap={1}>
                <Icon as={SealCheck} h={4} w={4} color="green.600" />
                <Text fontSize={'md'}>Verified</Text>
              </Flex>
            </Tag>
          )}
          {hasSBTCInName && !isSBTC && (
            <Tag
              color="red.600"
              bg="red.200"
              border="1px solid var(--stacks-colors-red-500)"
              pt={1}
              py={2.5}
            >
              <Flex alignItems={'center'} gap={1}>
                <Icon as={Warning} h={4} w={4} color="red.600" />
                <Text fontSize={'md'}>Unverified</Text>
              </Flex>
            </Tag>
          )}
        </Flex>
      </Stack>
      {hasSBTCInName && !isSBTC && (
        <Box borderRadius="xl" bg="red.200" p={4}>
          <Flex gap={2}>
            <Icon as={Warning} h={4} w={4} color="red.600" />
            <Text fontSize="sm" display="inline">
              <Text as="span" fontWeight="bold">
                Warning:&nbsp;
              </Text>
              This is not{' '}
              <Link
                href="https://explorer.hiro.so/token/SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token?chain=mainnet"
                isExternal
              >
                the official sBTC token
              </Link>{' '}
              and may be a scam. Engaging with unverified tokens could result in loss of funds.
            </Text>
          </Flex>
        </Box>
      )}
      <TokenInfo tokenInfo={tokenInfo} tokenId={tokenId} />
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
