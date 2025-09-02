'use client';

import { useHomePageData } from '@/app/context';
import { ButtonLink } from '@/ui/ButtonLink';
import { Text } from '@/ui/Text';
import { HStack, Icon, Stack } from '@chakra-ui/react';
import { useState } from 'react';

import { BurnBlock } from '@stacks/blockchain-api-client';
import { NakamotoBlock } from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { TabsContent, TabsLabel, TabsList, TabsRoot, TabsTrigger } from '../../../ui/Tabs';
import BitcoinIcon from '../../../ui/icons/BitcoinIcon';
import StacksIconThin from '../../../ui/icons/StacksIconThin';
import { RecentBtcBlocks } from './RecentBtcBlocks';
import { RecentStxBlocks } from './RecentStxBlocks';
import { RecentBlocksType, useRecentBlocks } from './useRecentBlocks';

function SectionHeader() {
  const network = useGlobalContext().activeNetwork;
  return (
    <HStack justify={'space-between'} align={'center'}>
      <Text whiteSpace={'nowrap'} textStyle="heading-md" color="textPrimary">
        Recent blocks
      </Text>
      <ButtonLink
        href={buildUrl('/blocks', network)}
        buttonLinkSize="big"
        display={{ base: 'none', md: 'inline' }}
        aria-label="View all blockchain blocks"
      >
        View all blocks
      </ButtonLink>
    </HStack>
  );
}

export function RecentBlocks() {
  const { initialRecentBlocks } = useHomePageData();

  const initialStxBlocksData = initialRecentBlocks?.stxBlocks.results as NakamotoBlock[];
  const initialBtcBlocksData = initialRecentBlocks?.btcBlocks.results as BurnBlock[];

  const [activeTab, setActiveTab] = useState<RecentBlocksType>('btc');
  const {
    stxBlocks: newStxBlocksData,
    btcBlocks: newBtcBlocksData,
    hasNewBtcBlocks,
    hasNewStxBlocks,
    handleUpdate,
  } = useRecentBlocks(activeTab);

  const stxBlocks =
    newStxBlocksData && newStxBlocksData.length > 0 ? newStxBlocksData : initialStxBlocksData || [];
  const btcBlocks =
    newBtcBlocksData && newBtcBlocksData.length > 0 ? newBtcBlocksData : initialBtcBlocksData || [];

  return (
    <Stack aria-label="Recent blocks" gap={4}>
      <TabsRoot
        variant={'primary'}
        size={'redesignMd'}
        defaultValue={'btc'}
        gap={2}
        lazyMount
        aria-label="Block view options"
        onValueChange={details => setActiveTab(details.value as RecentBlocksType)}
        value={activeTab}
      >
        <HStack gap={0} pb={4} w={'100%'}>
          <TabsLabel as="span" id="tab-group-label" whiteSpace={'nowrap'}>
            View by:
          </TabsLabel>
          <TabsList aria-labelledby="tab-group-label">
            <TabsTrigger value="btc" gap={1.5} aria-label="View Bitcoin blocks">
              <Icon aria-hidden="true">
                <BitcoinIcon />
              </Icon>
              Bitcoin block
            </TabsTrigger>
            <TabsTrigger value="stx" gap={1.5} aria-label="View Stacks blocks">
              <Icon aria-hidden="true">
                <StacksIconThin />
              </Icon>
              Stacks block
            </TabsTrigger>
          </TabsList>
        </HStack>

        <TabsContent value="btc" aria-label="Bitcoin blocks tab panel" role="tabpanel" tabIndex={0}>
          <RecentBtcBlocks
            hasNewBlocks={hasNewBtcBlocks}
            handleUpdate={handleUpdate}
            btcBlocks={btcBlocks}
          />
        </TabsContent>

        <TabsContent value="stx" aria-label="Stacks blocks tab panel" role="tabpanel" tabIndex={0}>
          <RecentStxBlocks
            hasNewBlocks={hasNewStxBlocks}
            handleUpdate={handleUpdate}
            stxBlocks={stxBlocks}
            btcBlocks={btcBlocks}
          />
        </TabsContent>
      </TabsRoot>
    </Stack>
  );
}

export function RecentBlocksSection() {
  const network = useGlobalContext().activeNetwork;
  return (
    <Stack aria-label="Recent blocks" gap={6}>
      <SectionHeader />
      <RecentBlocks />
      <ButtonLink
        href={buildUrl('/blocks', network)}
        buttonLinkSize="big"
        display={{ base: 'inline', md: 'none' }}
        aria-label="View all blockchain blocks"
      >
        View all blocks
      </ButtonLink>
    </Stack>
  );
}
