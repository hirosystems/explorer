import { Block } from '@stacks/stacks-blockchain-api-types';
import { Flex } from '@/ui/Flex';
import { Icon } from '@/ui/Icon';
import { PiArrowElbowLeftDown } from 'react-icons/pi';
import { BitcoinIcon } from '@/ui/icons';
import { toRelativeTime, truncateMiddle } from '@/common/utils';
import * as React from 'react';
import { Stack } from '@/ui/Stack';
import { Box } from '@/ui/Box';
import { BlockLink } from '@/components/links';
import { Grid } from '@/ui/Grid';
import { Text } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import { AiOutlineClockCircle } from 'react-icons/ai';

interface BlockWithFullnessGroupedByBtcBlockProps {
  burnBlockHeight: string;
  blocks: Block[];
  isCurrent?: boolean;
}

export function BlockWithFullnessGroupedByBtcBlock({
  burnBlockHeight,
  blocks,
  isCurrent,
}: BlockWithFullnessGroupedByBtcBlockProps) {
  const colorMode = useColorMode().colorMode;
  return (
    <Stack borderRadius={'6px'} borderWidth={'1px'} borderColor={'#DCDDE2'} width={'100%'}>
      <Flex
        borderBottomWidth={'1px'}
        borderColor={'#DCDDE2'}
        padding={'12px 21px'}
        justifyContent={'space-between'}
      >
        <Flex alignItems={'center'} gap={'3px'}>
          <Icon
            as={PiArrowElbowLeftDown}
            size={'15px'}
            color={isCurrent ? '#ACADB1' : '#8D929A'}
            position={'relative'}
            top={'2px'}
          />
          <Icon as={BitcoinIcon} color={isCurrent ? '#FABE76' : '#f7931a'} size={19} />
          <Text fontSize={'14px'} lineHeight={'1.5em'} color={isCurrent ? '#ACADB1' : undefined}>
            {isCurrent ? 'Next Bitcoin block' : `#${burnBlockHeight}`}
          </Text>
        </Flex>
        <Flex alignItems={'center'}>
          {isCurrent && <Icon as={AiOutlineClockCircle} size="16px" mr="4px" color={'#8D929A'} />}
          <Text fontSize={'12px'} color={'#74777D'} lineHeight={'1.5em'}>
            {isCurrent ? (
              'Unconfirmed'
            ) : (
              <>
                {truncateMiddle(burnBlockHeight, 6)} ·{' '}
                <Text color={'#242629'} display={'inline'}>
                  {toRelativeTime(blocks[0].burn_block_time * 1000)}
                </Text>
              </>
            )}
          </Text>
        </Flex>
      </Flex>
      <Stack p={'10px 20px 13px 20px'} gap={'12px'}>
        <Grid gridTemplateColumns={'repeat(auto-fill, minmax(20px, 1fr))'} gridGap={'3px'}>
          {blocks.map(block => (
            <BlockLink hash={block.hash} key={block.hash}>
              <Box
                width={'20px'}
                height={'20px'}
                backgroundColor={'brand.light'}
                opacity={Math.random() * (1 - 0.25) + 0.25}
                borderRadius={'3px'}
              />
            </BlockLink>
          ))}
        </Grid>
        <hr style={{ borderColor: `border.${colorMode}` }} />
        <Text display={'block'} color={'#74777D'} fontSize={'12px'}>
          {blocks.length} blocks · {blocks.reduce((acc, block) => acc + block.txs.length, 0)} txn
        </Text>
      </Stack>
    </Stack>
  );
}
