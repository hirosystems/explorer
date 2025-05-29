import { UIStxBlock } from '@/app/data';
import { formatTimestampTo12HourTime } from '@/common/utils/time-utils';
import { Flex, HStack, Icon, Stack } from '@chakra-ui/react';
import { CaretRight, Circle } from '@phosphor-icons/react';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Link } from '../../../ui/Link';
import { Text } from '../../../ui/Text';
import BitcoinCircleIcon from '../../../ui/icons/BitcoinCircleIcon';
import StxSquareIcon from '../../../ui/icons/StxSquareIcon';
import { BORDER_WIDTH, BTC_BLOCK_MIN_WIDTH, SMALL_RING_WIDTH } from './consts';

export function StxBlockGroup({
  btcBlockHeight,
  btcBlockTime,
  stxBlocks,
  newestStxBlockHeight,
  totalStxBlockCount,
}: {
  btcBlockHeight: number;
  btcBlockTime: number;
  stxBlocks: UIStxBlock[];
  newestStxBlockHeight: number;
  totalStxBlockCount: number;
}) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Flex
      className="stx-block-group"
      bg={
        'linear-gradient(to bottom, var(--stacks-colors-redesign-border-primary), var(--stacks-colors-surface-secondary))'
      }
      padding={`${BORDER_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH}px)`}
      css={{
        '&:hover:not(:has(.stx-block:hover)):not(:has(.newest-stx-block:hover))': {
          background:
            'linear-gradient(to bottom, var(--stacks-colors-accent-bitcoin-500), var(--stacks-colors-surface-secondary))',
          '& .btc-block': { bg: 'surfacePrimary' },
        },
      }}
      cursor={'pointer'}
      align={'stretch'}
    >
      <Stack
        position="relative"
        gap={2}
        bg="surfaceSecondary"
        borderRadius="redesign.lg"
        p={2}
        whiteSpace={'nowrap'}
        justify="space-between"
      >
        <HStack
          gap={1.5}
          px={1.5}
          py={1}
          borderRadius={'redesign.sm'}
          className="btc-block"
          w="fit-content"
          asChild
        >
          <Link
            href={buildUrl(`/btcblock/${stxBlocks[0].burn_block_hash}`, network)}
            _hover={{ textDecoration: 'none' }}
            target={'_blank'}
          >
            <HStack
              separator={
                <Icon w={1} h={1} fill={'textSecondary'}>
                  <Circle weight="fill" />
                </Icon>
              }
              align={'center'}
            >
              <HStack borderRadius={'redesign.sm'}>
                <Icon w={4} h={4} color="accent.bitcoin-500">
                  <BitcoinCircleIcon />
                </Icon>
                <Text textStyle={'text-mono-sm'} color={'textPrimary'} className={'block-height'}>
                  #{btcBlockHeight}
                </Text>
              </HStack>
              <Text
                textStyle={'text-medium-xs'}
                color={'textSecondary'}
                lineHeight={'redesign.shorter'}
                suppressHydrationWarning
              >
                {formatTimestampTo12HourTime(btcBlockTime, {
                  useLocalTime: true,
                  includeSeconds: true,
                })}
              </Text>
              <Text
                textStyle={'text-medium-xs'}
                color={'textSecondary'}
                lineHeight={'redesign.shorter'}
              >
                {totalStxBlockCount} block{totalStxBlockCount > 1 ? 's' : ''}
              </Text>
            </HStack>
            <Icon w={3} h={3} color={'iconTertiary'}>
              <CaretRight />
            </Icon>
          </Link>
        </HStack>
        <HStack>
          {stxBlocks.map(stxBlock =>
            stxBlock.height === newestStxBlockHeight ? (
              <NewestStxBlock key={stxBlock.hash} stxBlock={stxBlock} />
            ) : (
              <StxBlock key={stxBlock.hash} stxBlock={stxBlock} />
            )
          )}
        </HStack>
      </Stack>
    </Flex>
  );
}

export function StxBlock({ stxBlock }: { stxBlock: UIStxBlock }) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Flex
      className="stx-block"
      bg={
        'linear-gradient(to bottom, var(--stacks-colors-accent-stacks-500), var(--stacks-colors-surface-primary))'
      }
      padding={`${BORDER_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH}px)`}
      _hover={{
        bg: 'var(--stacks-colors-accent-stacks-500)',
        '& .block-height': { textDecoration: 'underline' },
        '& .stacks-blocks-count': { color: 'textPrimary' },
        '& .caret-icon': { background: 'surfaceSecondary', color: 'iconPrimary' },
      }}
      cursor={'pointer'}
      asChild
    >
      <Link
        href={buildUrl(`/block/${stxBlock.hash}`, network)}
        target={'_blank'}
        rel="noreferrer"
        _hover={{ textDecoration: 'none' }}
      >
        <Stack
          position="relative"
          gap={0}
          minW={BTC_BLOCK_MIN_WIDTH}
          p={2}
          bg="surfacePrimary"
          borderRadius="redesign.lg"
          flex="0 0 auto"
        >
          <Stack gap={2}>
            <HStack gap={0} justifyContent={'space-between'} align={'stretch'}>
              <HStack
                gap={1.5}
                px={1.5}
                py={1}
                borderRadius={'redesign.sm'}
                bg={'surfaceSecondary'}
              >
                <Icon w={4} h={4} color={'accent.stacks-500'}>
                  <StxSquareIcon />
                </Icon>

                <Text
                  textStyle={'text-mono-sm'}
                  color={'textPrimary'}
                  className={'block-height'}
                  aria-label={`Block height: ${stxBlock.height.toLocaleString()}`}
                >
                  #{stxBlock.height}
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
              >
                <CaretRight />
              </Icon>
            </HStack>
            <HStack
              separator={
                <Icon w={1} h={1} fill={'textSecondary'}>
                  <Circle weight="fill" />
                </Icon>
              }
              align={'center'}
            >
              <Text
                textStyle={'text-medium-xs'}
                color={'textSecondary'}
                aria-label={`Block timestamp: ${stxBlock.burn_block_time}`}
                suppressHydrationWarning
              >
                {formatTimestampTo12HourTime(stxBlock.burn_block_time, {
                  useLocalTime: true,
                  includeSeconds: true,
                })}
              </Text>
              <Text
                textStyle={'text-medium-xs'}
                color={'textSecondary'}
                aria-label={`${stxBlock.tx_count} transactions in this block`}
              >
                {stxBlock.tx_count} tx{stxBlock.tx_count > 1 ? 's' : ''}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </Link>
    </Flex>
  );
}

export function NewestStxBlock({ stxBlock }: { stxBlock: UIStxBlock }) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Flex
      className="newest-stx-block"
      bg={
        'linear-gradient(to bottom, var(--stacks-colors-alpha-stacks-500-alpha-30), var(--stacks-colors-alpha-stacks-300-alpha-30))'
      }
      padding={`${SMALL_RING_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH + SMALL_RING_WIDTH}px)`}
      my={`-${SMALL_RING_WIDTH}px`}
      asChild
      _hover={{
        bg: 'linear-gradient(to bottom, var(--stacks-colors-alpha-stacks-500-alpha-50), var(--stacks-colors-alpha-stacks-300-alpha-50))',
        '& .block-height': { textDecoration: 'underline' },
        '& .caret-icon': { background: 'surfacePrimary', color: 'iconPrimary' },
      }}
      role={'group'}
    >
      <Link
        href={buildUrl(`/block/${stxBlock.hash}`, network)}
        target={'_blank'}
        rel="noreferrer"
        _hover={{ textDecoration: 'none' }}
      >
        <Flex
          bg={
            'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-75), var(--stacks-colors-accent-stacks-400))'
          }
          padding={`${BORDER_WIDTH}px`}
          borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH}px)`}
        >
          <Stack
            position="relative"
            gap={0}
            minW={BTC_BLOCK_MIN_WIDTH}
            p={2}
            bg="surfaceTertiary"
            borderRadius="redesign.lg"
            flex="0 0 auto"
          >
            <Stack gap={2}>
              <HStack gap={0} justifyContent={'space-between'} align={'stretch'}>
                <HStack
                  gap={1.5}
                  px={1.5}
                  py={1}
                  borderRadius={'redesign.sm'}
                  bg={'surfacePrimary'}
                >
                  <Icon w={4} h={4} color={'accent.stacks-500'}>
                    <StxSquareIcon />
                  </Icon>
                  <Text textStyle={'text-mono-sm'} color={'textPrimary'} className={'block-height'}>
                    #{stxBlock.height}
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
                >
                  <CaretRight />
                </Icon>
              </HStack>
              <HStack
                separator={
                  <Icon w={1} h={1} fill={'textSecondary'}>
                    <Circle weight="fill" />
                  </Icon>
                }
                align={'center'}
              >
                <Text textStyle={'text-medium-xs'} color={'textSecondary'} suppressHydrationWarning>
                  {formatTimestampTo12HourTime(stxBlock.block_time, {
                    useLocalTime: true,
                    includeSeconds: true,
                  })}
                </Text>
                <Text textStyle={'text-medium-xs'} color={'textSecondary'}>
                  {stxBlock.tx_count} tx{stxBlock.tx_count > 1 ? 's' : ''}
                </Text>
              </HStack>
            </Stack>
          </Stack>
        </Flex>
      </Link>
    </Flex>
  );
}
