import { Box, Icon, Stack, StackProps } from '@chakra-ui/react';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Block, NakamotoBlock } from '@stacks/blockchain-api-client';

import { Text } from '../../../ui/Text';
import { useSubscribeBlocks } from '../BlockList/Sockets/useSubscribeBlocks';
import { BTC_BLOCK_MIN_WIDTH, EMPTY_BTC_BLOCK_WIDTH } from './consts';

export function NewBlockPlaceholder({
  newestBlockHeight,
  refetch,
  boxShadow,
  isNewBlock,
  ...stackProps
}: {
  newestBlockHeight: number;
  refetch: () => void;
  isNewBlock: (block: NakamotoBlock | Block, lastBlockHeight: number) => boolean;
} & StackProps) {
  const [hasNewBlocks, setHasNewBlocks] = useState(false);
  const [socketEnabled, setSocketEnabled] = useState(true);
  const lastBlockHeightRef = useRef(newestBlockHeight);

  const handleNewBlock = useCallback(
    (block: NakamotoBlock | Block) => {
      if (isNewBlock(block, lastBlockHeightRef.current)) {
        setHasNewBlocks(true);
        setSocketEnabled(false);
      }
    },
    [isNewBlock]
  );

  useSubscribeBlocks(socketEnabled, handleNewBlock);

  useEffect(() => {
    lastBlockHeightRef.current = newestBlockHeight;
    setHasNewBlocks(false);
  }, [newestBlockHeight]);

  const handleUpdate = useCallback(() => {
    refetch();
    setHasNewBlocks(false);
    setSocketEnabled(true);
  }, [refetch]);

  return (
    <Stack
      width={hasNewBlocks ? BTC_BLOCK_MIN_WIDTH : EMPTY_BTC_BLOCK_WIDTH}
      flex="0 0 auto"
      alignItems="center"
      justifyContent="center"
      gap={1.5}
      p={5}
      borderRadius={hasNewBlocks ? 'redesign.lg' : 'redesign.xs'}
      transition="all 0.2s ease-in-out"
      cursor={hasNewBlocks ? 'pointer' : 'default'}
      onClick={hasNewBlocks ? handleUpdate : undefined}
      boxShadow={hasNewBlocks ? boxShadow : undefined}
      role={hasNewBlocks ? 'button' : 'none'}
      aria-label={
        hasNewBlocks ? 'New blocks available. Click to update.' : 'Placeholder for new blocks'
      }
      aria-live="polite"
      tabIndex={hasNewBlocks ? 0 : -1}
      onKeyDown={e => {
        if (hasNewBlocks && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleUpdate();
        }
      }}
      {...stackProps}
    >
      <Box
        opacity={hasNewBlocks ? 1 : 0}
        transition="opacity 0.2s ease-in-out"
        aria-hidden={!hasNewBlocks}
      >
        <Text textStyle="text-medium-sm" color="textTertiary" textAlign="center" lineClamp={2}>
          New blocks have been mined.
        </Text>
        <Text
          textStyle="text-medium-sm"
          color="textSecondary"
          display="flex"
          gap={1.5}
          alignItems="center"
          justifyContent="center"
        >
          Update
          <Icon w={3.5} h={3.5} aria-hidden="true">
            <ArrowsClockwise />
          </Icon>
        </Text>
      </Box>
    </Stack>
  );
}
