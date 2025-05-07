'use client';

import { ButtonLink } from '@/ui/ButtonLink';
import { Text } from '@/ui/Text';
import { HStack, Icon, Stack } from '@chakra-ui/react';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { TabsContent, TabsLabel, TabsList, TabsRoot, TabsTrigger } from '../../../ui/Tabs';
import BitcoinIcon from '../../../ui/icons/BitcoinIcon';
import StxIcon from '../../../ui/icons/StxIcon';
import { RecentBtcBlocks } from './RecentBtcBlocks';
import { RecentStxBlocks } from './RecentStxBlocks';

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
        display={{ base: 'none', sm: 'inline' }}
        aria-label="View all blockchain blocks"
      >
        View all blocks
      </ButtonLink>
    </HStack>
  );
}

export function RecentBlocks() {
  return (
    <Stack aria-label="Recent blocks" gap={4}>
      <TabsRoot
        variant={'primary'}
        size={'redesignMd'}
        defaultValue={'btc'}
        gap={2}
        lazyMount
        aria-label="Block view options"
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
                <StxIcon />
              </Icon>
              Stacks block
            </TabsTrigger>
          </TabsList>
        </HStack>

        <TabsContent value="btc" aria-label="Bitcoin blocks tab panel" role="tabpanel" tabIndex={0}>
          <RecentBtcBlocks />
        </TabsContent>

        <TabsContent value="stx" aria-label="Stacks blocks tab panel" role="tabpanel" tabIndex={0}>
          <RecentStxBlocks />
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
        display={{ base: 'inline', sm: 'none' }}
        aria-label="View all blockchain blocks"
      >
        View all blocks
      </ButtonLink>
    </Stack>
  );
}
