'use client';

import { Box, Icon, Stack, StackProps } from '@chakra-ui/react';
import { ArrowsClockwise } from '@phosphor-icons/react';

import { Text } from '../../../ui/Text';
import { BTC_BLOCK_MIN_WIDTH, EMPTY_BTC_BLOCK_WIDTH } from './consts';

interface NewBlockPlaceholderProps extends Omit<StackProps, 'boxShadow'> {
  hasNewBlocks: boolean;
  handleUpdate: () => void;
  boxShadow?: string;
}

export function NewBlockPlaceholder({
  hasNewBlocks,
  handleUpdate,
  boxShadow,
  ...stackProps
}: NewBlockPlaceholderProps) {
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

export function StacksNewBlockPlaceholder({ ...props }: NewBlockPlaceholderProps) {
  return (
    <NewBlockPlaceholder
      id="stacks-new-block-placeholder"
      border="1px dashed var(--stacks-colors-accent-stacks-500)"
      boxShadow={'0px 4px 12px 0px rgba(255, 85, 18, 0.25)'}
      {...props}
    />
  );
}

export function BtcNewBlockPlaceholder({ ...props }: NewBlockPlaceholderProps) {
  return (
    <NewBlockPlaceholder
      id="btc-new-block-placeholder"
      border="1px dashed var(--stacks-colors-accent-bitcoin-500)"
      boxShadow={'0px 4px 12px 0px rgba(255, 145, 0, 0.25)'}
      {...props}
    />
  );
}
