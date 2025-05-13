'use client';

import { Text } from '@/ui/Text';
import { HStack, Icon, Stack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Link } from '../../../ui/Link';
import { TabsContent, TabsLabel, TabsList, TabsRoot, TabsTrigger } from '../../../ui/Tabs';
import BitcoinIcon from '../../../ui/icons/BitcoinIcon';
import StxIcon from '../../../ui/icons/StxIcon';
import { RecentBtcBlocks } from './RecentBtcBlocks';
import { RecentStxBlocks } from './RecentStxBlocks';

export function RecentBlocks() {
  const network = useGlobalContext().activeNetwork;

  return (
    <Stack aria-label="Recent blocks" gap={4}>
      <Text whiteSpace={'nowrap'} textStyle="heading-md" color="textPrimary">
        Recent blocks
      </Text>
      <TabsRoot
        variant={'primary'}
        size={'redesignMd'}
        defaultValue={'btc'}
        gap={2}
        lazyMount
        aria-label="Block view options"
      >
        <HStack gap={0} pb={3} w={'100%'}>
          <TabsLabel as="span" id="tab-group-label">
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
          <Link
            href={buildUrl('/blocks', network)}
            variant={'buttonLink'}
            size={'lg'}
            ml={'auto'}
            mb={'auto'}
            display={['none', 'inline']}
            aria-label="View all blockchain blocks"
          >
            View all blocks
            <Icon w={3.5} h={3.5} aria-hidden="true">
              <ArrowRight />
            </Icon>
          </Link>
        </HStack>

        <TabsContent value="btc" aria-label="Bitcoin blocks tab panel" role="tabpanel" tabIndex={0}>
          <RecentBtcBlocks />
        </TabsContent>

        <TabsContent value="stx" aria-label="Stacks blocks tab panel" role="tabpanel" tabIndex={0}>
          <RecentStxBlocks />
        </TabsContent>

        <Link
          href={buildUrl('/blocks', network)}
          variant={'buttonLink'}
          size={'lg'}
          mr={'auto'}
          display={['inline', 'none']}
          ml={[0, 3]}
          aria-label="View all blockchain blocks"
        >
          View all blocks
          <Icon w={3.5} h={3.5} aria-hidden="true">
            <ArrowRight />
          </Icon>
        </Link>
      </TabsRoot>
    </Stack>
  );
}
