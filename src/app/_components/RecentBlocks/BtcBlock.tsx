import { formatTimestampToRelativeTime } from '@/common/utils/time-utils';
import StacksIconBlock from '@/ui/icons/StacksIconBlock';
import { Flex, HStack, Icon, Stack } from '@chakra-ui/react';
import { CaretRight } from '@phosphor-icons/react';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Link } from '../../../ui/Link';
import { Text } from '../../../ui/Text';
import BitcoinCircleIcon from '../../../ui/icons/BitcoinCircleIcon';
import StxSquareIcon from '../../../ui/icons/StxSquareIcon';
import { BORDER_WIDTH, BTC_BLOCK_MIN_WIDTH, RING_WIDTH } from './consts';

export function BtcBlock({ burnBlock }: { burnBlock: BurnBlock }) {
  const network = useGlobalContext().activeNetwork;
  return (
    <Flex
      bg={
        'linear-gradient(to bottom, var(--stacks-colors-accent-bitcoin-500), var(--stacks-colors-surface-primary))'
      }
      padding={`${BORDER_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH}px)`}
      _hover={{
        bg: 'var(--stacks-colors-accent-bitcoin-500)',
        '& .block-height': { textDecoration: 'underline' },
        '& .stacks-blocks-count': { color: 'textPrimary' },
        '& .caret-icon': { background: 'surfaceSecondary', color: 'iconPrimary' },
      }}
      cursor={'pointer'}
      align={'stretch'}
      asChild
    >
      <Link
        href={buildUrl(`/btcblock/${burnBlock.burn_block_hash}`, network)}
        _hover={{ textDecoration: 'none' }}
        aria-label={`Bitcoin block ${formatTimestampToRelativeTime(burnBlock.burn_block_height)} mined at ${formatTimestampToRelativeTime(
          burnBlock.burn_block_time
        )} with ${burnBlock.stacks_blocks.length} Stacks blocks`}
        role="listitem"
        tabIndex={0}
        variant="underlineOnHover"
      >
        <Stack
          position="relative"
          gap={0}
          minW={BTC_BLOCK_MIN_WIDTH}
          p={3}
          bg="surfacePrimary"
          borderRadius="redesign.lg"
        >
          <Stack gap={4} justifyContent={'space-between'} flex={1}>
            <Stack gap={2}>
              <HStack gap={0} justifyContent={'space-between'} align={'stretch'}>
                <HStack
                  gap={1.5}
                  px={1.5}
                  py={1}
                  borderRadius={'redesign.sm'}
                  bg={'surfaceSecondary'}
                >
                  <Icon w={4} h={4} aria-hidden="true" color="accent.bitcoin-500">
                    <BitcoinCircleIcon />
                  </Icon>
                  <Text textStyle={'text-mono-sm'} color={'textPrimary'} className={'block-height'}>
                    #{burnBlock.burn_block_height}
                  </Text>
                </HStack>
                <Icon
                  w={7}
                  h={'auto'}
                  color={'iconTertiary'}
                  borderRadius={'redesign.sm'}
                  px={1.5}
                  py={1}
                  className={'caret-icon'}
                  aria-hidden="true"
                >
                  <CaretRight />
                </Icon>
              </HStack>
              <Text
                textStyle={'text-medium-xs'}
                color={'textSecondary'}
                aria-label={`Block timestamp: ${burnBlock.burn_block_time}`}
                suppressHydrationWarning
              >
                {formatTimestampToRelativeTime(burnBlock.burn_block_time)}
              </Text>
            </Stack>
            <HStack gap={1.5} p={2} borderRadius={'redesign.md'} bg={'surfaceSecondary'}>
              <Icon w={4} h={4} aria-hidden="true">
                <StacksIconBlock color={'var(--stacks-colors-icon-tertiary)'} />
              </Icon>
              <Text
                textStyle={'text-medium-xs'}
                color={'textSecondary'}
                className={'stacks-blocks-count'}
                whiteSpace={'nowrap'}
                aria-label={`${burnBlock.stacks_blocks.length} Stacks blocks in this Bitcoin block`}
              >
                {burnBlock.stacks_blocks.length} Stacks blocks
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </Link>
    </Flex>
  );
}

export function NewestBtcBlock({ burnBlock }: { burnBlock: BurnBlock }) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Flex
      bg={{
        base: 'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-15), var(--stacks-colors-alpha-bitcoin-200-alpha-15))',
        _dark:
          'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-600-alpha-15), var(--stacks-colors-alpha-stacks-600-alpha-15))',
      }}
      padding={`${RING_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH + RING_WIDTH * 2}px)`}
      my={`-${RING_WIDTH * 2}px`}
      asChild
      _hover={{
        bg: 'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-25), var(--stacks-colors-alpha-bitcoin-200-alpha-25))',
        '& .block-height': { textDecoration: 'underline' },
        '& .caret-icon': { background: 'surfacePrimary', color: 'iconPrimary' },
      }}
      role={'group'}
      align={'stretch'}
    >
      <Link
        href={buildUrl(`/btcblock/${burnBlock.burn_block_hash}`, network)}
        rel="noreferrer"
        _hover={{ textDecoration: 'none' }}
        aria-label={`Newest Bitcoin block ${burnBlock.burn_block_height} mined at ${burnBlock.burn_block_time} with ${burnBlock.stacks_blocks.length} Stacks blocks`}
        role="listitem"
        tabIndex={0}
      >
        <Flex
          bg={{
            base: 'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-40), var(--stacks-colors-alpha-bitcoin-200-alpha-40))',
            _dark:
              'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-600-alpha-40), var(--stacks-colors-alpha-stacks-600-alpha-40))',
          }}
          padding={`${RING_WIDTH}px`}
          borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH + RING_WIDTH}px)`}
          _hover={{
            bg: 'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-60), var(--stacks-colors-alpha-bitcoin-200-alpha-60))',
          }}
          align="stretch"
        >
          <Flex
            bg={{
              base: 'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-75), var(--stacks-colors-alpha-stacks-400))',
              _dark:
                'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-600-alpha-75), var(--stacks-colors-alpha-stacks-500))',
            }}
            padding={`${BORDER_WIDTH}px`}
            borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH}px)`}
          >
            <Stack
              position="relative"
              gap={0}
              minW={BTC_BLOCK_MIN_WIDTH}
              p={3}
              bg="surfaceTertiary"
              borderRadius="redesign.lg"
            >
              <Stack gap={4}>
                <Stack gap={2}>
                  <HStack gap={0} justifyContent={'space-between'} align={'stretch'}>
                    <HStack
                      gap={1.5}
                      px={1.5}
                      py={1}
                      borderRadius={'redesign.sm'}
                      bg={'surfacePrimary'}
                    >
                      <Icon w={4} h={4} aria-hidden="true" color="accent.bitcoin-500">
                        <BitcoinCircleIcon />
                      </Icon>
                      <Text
                        textStyle={'text-mono-sm'}
                        color={'textPrimary'}
                        className={'block-height'}
                      >
                        #{burnBlock.burn_block_height}
                      </Text>
                    </HStack>
                    <Icon
                      w={7}
                      h={'auto'}
                      color={'iconTertiary'}
                      borderRadius={'redesign.sm'}
                      px={1.5}
                      py={1}
                      className={'caret-icon'}
                      aria-hidden="true"
                    >
                      <CaretRight />
                    </Icon>
                  </HStack>
                  <Text
                    textStyle={'text-medium-xs'}
                    color={'textSecondary'}
                    aria-label={`Block timestamp: ${formatTimestampToRelativeTime(burnBlock.burn_block_time)}`}
                    suppressHydrationWarning
                  >
                    {formatTimestampToRelativeTime(burnBlock.burn_block_time)}
                  </Text>
                </Stack>
                <HStack gap={1.5} p={2} borderRadius={'redesign.md'} bg={'surfacePrimary'}>
                  <Icon w={4} h={4} aria-hidden="true">
                    <StacksIconBlock color={'var(--stacks-colors-icon-tertiary)'} />
                  </Icon>
                  <Text
                    textStyle={'text-medium-xs'}
                    color={'textPrimary'}
                    whiteSpace={'nowrap'}
                    aria-label={`${burnBlock.stacks_blocks.length} Stacks blocks in this Bitcoin block`}
                  >
                    {burnBlock.stacks_blocks.length} Stacks blocks
                  </Text>
                </HStack>
              </Stack>
            </Stack>
          </Flex>
        </Flex>
      </Link>
    </Flex>
  );
}
