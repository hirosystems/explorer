import { Box, Icon, Stack } from '@chakra-ui/react';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

import { Text } from '../../../ui/Text';
import { useSubscribeBlocks } from '../BlockList/Sockets/useSubscribeBlocks';
import { BTC_BLOCK_MIN_WIDTH, EMPTY_BTC_BLOCK_WIDTH } from './consts';

export function NewBlockPlaceholder({
  newestBtcBlockHeight,
  refetch,
}: {
  newestBtcBlockHeight: number;
  refetch: () => void;
}) {
  const [hasNewBlocks, setHasNewBlocks] = useState(false);
  const lastBlockHeightRef = useRef(newestBtcBlockHeight);

  const sub = useSubscribeBlocks(true, block => {
    if (block.burn_block_height > lastBlockHeightRef.current) {
      setHasNewBlocks(true);
      sub.current?.unsubscribe();
    }
  });

  useEffect(() => {
    lastBlockHeightRef.current = newestBtcBlockHeight;
    setHasNewBlocks(false);
  }, [newestBtcBlockHeight]);

  return (
    <Stack
      width={hasNewBlocks ? BTC_BLOCK_MIN_WIDTH : EMPTY_BTC_BLOCK_WIDTH}
      border="1px dashed var(--stacks-colors-accent-bitcoin-500)"
      flex="0 0 auto"
      alignItems="center"
      justifyContent="center"
      gap={1.5}
      p={5}
      borderRadius={hasNewBlocks ? 'redesign.lg' : 'redesign.xs'}
      transition="all 0.2s ease-in-out"
      cursor={hasNewBlocks ? 'pointer' : 'default'}
      onClick={hasNewBlocks ? refetch : undefined}
      boxShadow={hasNewBlocks ? '0px 4px 12px 0px rgba(255, 145, 0, 0.25)' : undefined}
    >
      <Box opacity={hasNewBlocks ? 1 : 0} transition="opacity 0.2s ease-in-out">
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
          <Icon w={3.5} h={3.5}>
            <ArrowsClockwise />
          </Icon>
        </Text>
      </Box>
    </Stack>
  );
}
