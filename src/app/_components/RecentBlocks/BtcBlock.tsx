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
import { formatTimestamp } from './utils';

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
      }}
      cursor={'pointer'}
      asChild
    >
      <Link
        href={buildUrl(`/btcblock/${burnBlock.burn_block_hash}`, network)}
        target={'_blank'}
        rel="noreferrer"
      >
        <Stack
          position="relative"
          gap={0}
          minW={BTC_BLOCK_MIN_WIDTH}
          p={3}
          bg="surfacePrimary"
          borderRadius="redesign.lg"
          flex="0 0 auto"
        >
          <Stack gap={4}>
            <Stack gap={2}>
              <HStack gap={0} justifyContent={'space-between'}>
                <HStack
                  gap={1.5}
                  px={1.5}
                  py={1}
                  borderRadius={'redesign.sm'}
                  bg={'surfaceSecondary'}
                >
                  <Icon w={4} h={4}>
                    <BitcoinCircleIcon />
                  </Icon>
                  <Text textStyle={'text-mono-sm'} color={'textPrimary'} className={'block-height'}>
                    #{burnBlock.burn_block_height}
                  </Text>
                </HStack>
                <Icon w={4} h={4} color={'iconTertiary'}>
                  <CaretRight />
                </Icon>
              </HStack>
              <Text textStyle={'text-medium-xs'} color={'textSecondary'}>
                {formatTimestamp(burnBlock.burn_block_time)}
              </Text>
            </Stack>
            <HStack gap={1.5} p={2} borderRadius={'redesign.md'} bg={'surfaceSecondary'}>
              <Icon w={4} h={4} color={'iconTertiary'}>
                <StxSquareIcon />
              </Icon>
              <Text
                textStyle={'text-medium-xs'}
                color={'textSecondary'}
                className={'stacks-blocks-count'}
                whiteSpace={'nowrap'}
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
      bg={
        'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-15), var(--stacks-colors-alpha-bitcoin-200-alpha-15))'
      }
      padding={`${RING_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH + RING_WIDTH * 2}px)`}
      my={`-${RING_WIDTH * 2}px`}
      asChild
      _hover={{
        bg: 'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-25), var(--stacks-colors-alpha-bitcoin-200-alpha-25))',
        '& .block-height': { textDecoration: 'underline' },
      }}
      role={'group'}
    >
      <Link
        href={buildUrl(`/btcblock/${burnBlock.burn_block_hash}`, network)}
        target={'_blank'}
        rel="noreferrer"
      >
        <Flex
          bg={
            'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-40), var(--stacks-colors-alpha-bitcoin-200-alpha-40))'
          }
          padding={`${RING_WIDTH}px`}
          borderRadius={`calc(var(--stacks-radii-redesign-lg) + ${BORDER_WIDTH + RING_WIDTH}px)`}
          _hover={{
            bg: 'linear-gradient(to bottom, var(--stacks-colors-alpha-bitcoin-500-alpha-60), var(--stacks-colors-alpha-bitcoin-200-alpha-60))',
          }}
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
              p={3}
              bg="surfacePrimary"
              borderRadius="redesign.lg"
              flex="0 0 auto"
            >
              <Stack gap={4}>
                <Stack gap={2}>
                  <HStack gap={0} justifyContent={'space-between'}>
                    <HStack
                      gap={1.5}
                      px={1.5}
                      py={1}
                      borderRadius={'redesign.sm'}
                      bg={'surfaceSecondary'}
                    >
                      <Icon w={4} h={4}>
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
                    <Icon w={4} h={4} color={'iconTertiary'}>
                      <CaretRight />
                    </Icon>
                  </HStack>
                  <Text textStyle={'text-medium-xs'} color={'textSecondary'}>
                    {formatTimestamp(burnBlock.burn_block_time)}
                  </Text>
                </Stack>
                <HStack gap={1.5} p={2} borderRadius={'redesign.md'} bg={'surfaceSecondary'}>
                  <Icon w={4} h={4} color={'iconTertiary'}>
                    <StxSquareIcon />
                  </Icon>
                  <Text textStyle={'text-medium-xs'} color={'textPrimary'} whiteSpace={'nowrap'}>
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
