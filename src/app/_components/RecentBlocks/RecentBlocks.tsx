import { HStack, Icon } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Link } from '../../../ui/Link';
import { TabsContent, TabsLabel, TabsList, TabsRoot, TabsTrigger } from '../../../ui/Tabs';
import BitcoinIcon from '../../../ui/icons/BitcoinIcon';
import StxIcon from '../../../ui/icons/StxIcon';
import { RecentBtcBlocks } from './RecentBtcBlocks';

export function RecentBlocks() {
  const network = useGlobalContext().activeNetwork;
  return (
    <TabsRoot variant={'primary'} size={'redesignMd'} defaultValue={'btc'} ml={-3}>
      <HStack gap={0} pb={3} pl={3} w={'100%'}>
        <TabsLabel>View by:</TabsLabel>
        <TabsList>
          <TabsTrigger value="btc" gap={1.5}>
            <Icon>
              <BitcoinIcon />
            </Icon>
            Bitcoin block
          </TabsTrigger>
          <TabsTrigger value="stx" gap={1.5}>
            <Icon>
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
        >
          View all blocks
          <Icon w={3.5} h={3.5}>
            <ArrowRight />
          </Icon>
        </Link>
      </HStack>
      <TabsContent value="btc">
        <RecentBtcBlocks />
      </TabsContent>
      <TabsContent value="stx">Stacks blocks placeholder</TabsContent>
      <Link
        href={buildUrl('/blocks', network)}
        variant={'buttonLink'}
        size={'lg'}
        mr={'auto'}
        display={['inline', 'none']}
        ml={3}
      >
        View all blocks
        <Icon w={3.5} h={3.5}>
          <ArrowRight />
        </Icon>
      </Link>
    </TabsRoot>
  );
}
