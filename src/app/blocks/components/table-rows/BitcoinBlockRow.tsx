'use client';

import { TimeStampCellRenderer } from '@/common/components/table/table-examples/TxTableCellRenderers';
import { formatTimestamp, formatTimestampToRelativeTime } from '@/common/utils/time-utils';
import { truncateMiddle } from '@/common/utils/utils';
import { BlockHeightBadge, DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import StacksIconBlock from '@/ui/icons/StacksIconBlock';
import StxIcon from '@/ui/icons/StxIcon';
import { Box, Flex, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export const BitcoinBlockRow = {
  HeightCell: (height: number, burnBlockHash: string) => (
    <BlockHeightBadge blockType="btc" blockHeight={height} variant="outline" />
  ),

  HashCell: (hash: string, burnBlockHash: string) => (
    <Link
      as={NextLink}
      href={`/btcblock/${burnBlockHash}`}
      textStyle="text-regular-sm"
      color="textPrimary"
      textDecoration="underline"
      _hover={{
        color: 'textInteractiveHover',
      }}
    >
      {truncateMiddle(hash, 8, 8)}
    </Link>
  ),

  StacksBlocksIntervalCell: (stacksBlocks: string[] | undefined) => (
    <Flex align="center" gap={2}>
      {stacksBlocks && stacksBlocks.length > 0 ? (
        <>
          {stacksBlocks.slice(0, 2).map((blockHash, index) => (
            <Link
              as={NextLink}
              href={`/block/${blockHash}`}
              key={`${blockHash}-${index}`}
              _hover={{ textDecoration: 'none' }}
            >
              <DefaultBadge
                variant="outline"
                icon={<DefaultBadgeIcon icon={<StacksIconBlock />} color="iconTertiary" />}
                label={
                  <DefaultBadgeLabel
                    label={`#${truncateMiddle(blockHash, 4, 4)}`}
                    color="textPrimary"
                    textDecoration="underline"
                    _hover={{ color: 'textInteractiveHover' }}
                  />
                }
                bg="surfacePrimary"
                _groupHover={{ bg: 'surfaceTertiary' }}
              />
            </Link>
          ))}
          {stacksBlocks.length > 2 && (
            <Text textStyle="text-regular-xs" lineHeight="16px" color="textTertiary">
              +{stacksBlocks.length - 2}
            </Text>
          )}
        </>
      ) : (
        <Text textStyle="text-regular-sm" lineHeight="20px" color="textTertiary">
          —
        </Text>
      )}
    </Flex>
  ),

  StacksBlocksCell: (count: number) => (
    <Text textStyle="text-regular-sm" lineHeight="20px" color="textPrimary">
      {(count ?? 0).toLocaleString()}
    </Text>
  ),

  StacksTxsCell: (count: number) => (
    <Text textStyle="text-regular-sm" lineHeight="20px" color="textPrimary">
      {(count ?? 0).toLocaleString()}
    </Text>
  ),

  TotalFeesCell: (fees: string) => (
    <Flex align="center" gap={1.5} justifyContent="flex-end">
      <StxIcon width={10} height={12} color="iconSecondary" />
      <Text textStyle="text-regular-sm" lineHeight="20px" color="textPrimary">
        {fees}
      </Text>
    </Flex>
  ),

  TimestampCell: (timestamp: number) => (
    <Flex alignItems="center" justifyContent="flex-end" w="full">
      {TimeStampCellRenderer(
        formatTimestampToRelativeTime(timestamp),
        formatTimestamp(timestamp, 'HH:mm:ss', true)
      )}
    </Flex>
  ),
};
