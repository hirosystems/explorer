'use client';

import { BitcoinBlockChip, StacksBlockChip } from '@/common/components/BlockChips';
import { TimeStampCellRenderer } from '@/common/components/table/table-examples/TxTableCellRenderers';
import { formatTimestamp, formatTimestampToRelativeTime } from '@/common/utils/time-utils';
import { truncateMiddle } from '@/common/utils/utils';
import BitcoinIcon from '@/ui/icons/BitcoinIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { Box, Flex, Link, Text, Tooltip } from '@chakra-ui/react';
import NextLink from 'next/link';

export const StacksBlockRow = {
  HeightCell: (height: number) => (
    <StacksBlockChip
      value={height}
      iconColor="accent.bitcoin-500"
      bg="surfacePrimary"
      width="fit-content"
      textProps={{
        color: 'textPrimary',
        textDecoration: 'underline',
        _hover: {
          color: 'textInteractiveHover',
        },
      }}
      _groupHover={{ bg: 'surfaceTertiary' }}
    />
  ),

  HashCell: (hash: string) => (
    <Link
      as={NextLink}
      href={`/block/${hash}`}
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

  BitcoinBlockCell: (height: number, burnBlockHash: string) => (
    <Link as={NextLink} href={`/btcblock/${burnBlockHash}`} _hover={{ textDecoration: 'none' }}>
      <BitcoinBlockChip
        value={height}
        iconColor="iconSecondary"
        bg="surfacePrimary"
        textProps={{
          color: 'textPrimary',
          textDecoration: 'underline',
          _hover: {
            color: 'textInteractiveHover',
          },
        }}
        _groupHover={{ bg: 'surfaceTertiary' }}
      />
    </Link>
  ),

  TransactionsCell: (count: number) => (
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

  BurnBlockHeaderCell: (
    burnBlock: {
      burn_block_height: number;
      burn_block_hash: string;
      burn_block_time: number;
      stacks_blocks_count: number;
    },
    columnCount: number
  ) => (
    <Box
      position="relative"
      gridColumn={`1 / -1`}
      bg="surfaceSecondary"
      py={3}
      px={4}
      borderBottom="1px solid"
      borderColor="borderSecondary"
    >
      <Flex alignItems="center" gap={3}>
        <Link
          as={NextLink}
          href={`/btcblock/${burnBlock.burn_block_hash}`}
          _hover={{ textDecoration: 'none' }}
        >
          <BitcoinBlockChip
            value={burnBlock.burn_block_height}
            iconColor="accent.bitcoin-500"
            bg="surfaceTertiary"
            width="fit-content"
          />
        </Link>

        <Text textStyle="text-medium-sm" color="textSecondary">
          Bitcoin Block
        </Text>

        <Text textStyle="text-regular-xs" color="textTertiary">
          {burnBlock.stacks_blocks_count} Stacks block
          {burnBlock.stacks_blocks_count !== 1 ? 's' : ''}
        </Text>

        <Text fontSize="12px" color="textTertiary" ml="auto">
          {formatTimestamp(burnBlock.burn_block_time)}
        </Text>
      </Flex>
    </Box>
  ),
};
