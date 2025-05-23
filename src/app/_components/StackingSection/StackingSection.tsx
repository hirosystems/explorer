'use client';

import { useHomePageData } from '@/app/home-redesign/context';
import { formatDateShort } from '@/common/utils/date-utils';
import { abbreviateNumber } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import BitcoinCircleIcon from '@/ui/icons/BitcoinCircleIcon';
import ProgressDot from '@/ui/icons/ProgressDot';
import StxIcon from '@/ui/icons/StxIcon';
import StxSquareIcon from '@/ui/icons/StxSquareIcon';
import { Box, BoxProps, Flex, HStack, Icon, Stack } from '@chakra-ui/react';

function ProgressKnob({ diameter, ...boxProps }: { diameter: number } & BoxProps) {
  return (
    <Box
      bg={{ base: 'white', _dark: 'neutral.sand-900' }}
      h={diameter}
      w={diameter}
      borderRadius={'redesign.2xl'}
      position="absolute"
      top="50%"
      bottom="50%"
      m="auto"
      {...boxProps}
    />
  );
}

function ProgressBar({ percentage }: { percentage?: number }) {
  const PROGRESS_KNOB_DIAMETER = 1;
  return (
    <Stack
      bg={{
        base: 'neutral.sand-200',
        _dark: 'neutral.sand-700',
      }}
      h={2}
      borderRadius={'redesign.xl'}
      w="100%"
      position="relative"
    >
      <Tooltip
        variant="redesignPrimary"
        size="lg"
        content={`${percentage ? percentage : 0}% completed`}
      >
        <Stack
          bg={'accent.stacks-500'}
          h={2}
          borderRadius={'redesign.2xl'}
          w={`${percentage}%`}
          position="absolute"
          boxShadow={'0px 2px 10px 0px rgba(255, 85, 18, 0.50)'}
        />
      </Tooltip>
      <ProgressKnob
        diameter={PROGRESS_KNOB_DIAMETER}
        left={`calc(var(--stacks-spacing-${PROGRESS_KNOB_DIAMETER}) / 2)`}
      />
      <ProgressKnob
        diameter={PROGRESS_KNOB_DIAMETER}
        right={`calc(var(--stacks-spacing-${PROGRESS_KNOB_DIAMETER}) / 2)`}
      />
    </Stack>
  );
}

function CycleHeader() {
  const { approximateDaysTilNextCycle, cycleId } = useHomePageData().stackingCycle;
  return (
    <Stack gap="2" flex="1" height="100%" alignSelf="stretch">
      <HStack justify={'space-between'} align={['center', 'flex-start']}>
        <Text textStyle={'heading-xs'}>Current cycle</Text>
        <HStack
          borderRadius={['redesign.md', 'redesign.lg']}
          gap={2}
          color="textPrimary"
          boxShadow={'elevation1'}
          px="3"
          border={'1px solid'}
          borderColor={'redesignBorderSecondary'}
        >
          <Icon w="4" h="4" color={'feedback.green-500'}>
            <ProgressDot />
          </Icon>
          <Text textStyle={['text-medium-sm', 'heading-xs']}>
            Ends in ~{approximateDaysTilNextCycle} day{approximateDaysTilNextCycle > 1 ? 's' : ''}
          </Text>
        </HStack>
      </HStack>
      <HStack
        borderRadius={['redesign.xl', 'redesign.2xl']}
        gap={1.5}
        color="textPrimary"
        bg="surfaceTertiary"
        px="4"
        py="2"
        width="fit-content"
      >
        <Text textStyle={['heading-md', 'heading-lg']} lineHeight={'redesign.none'}>
          {cycleId}
        </Text>
      </HStack>
    </Stack>
  );
}

function StxStats() {
  const {
    stackingCycle: { stackedStx },
    stxPrice,
  } = useHomePageData();
  return (
    <HStack color="textPrimary" gap={[0.5, 1]}>
      <Icon w="4.5" h="4.5">
        <StxIcon />
      </Icon>
      <Text whiteSpace={'nowrap'} textStyle={['heading-xs', 'heading-sm']}>
        ${abbreviateNumber(stackedStx, 1)} STX{' '}
        <Text color="textSecondary" display={'inline'}>
          / ${abbreviateNumber(Math.round(stxPrice * stackedStx), 1)}
        </Text>{' '}
        stacked
      </Text>
    </HStack>
  );
}

function CycleProgress() {
  const {
    stackingCycle: { approximateStartTimestamp, approximateEndTimestamp, progressPercentage },
  } = useHomePageData();
  return (
    <Stack gap={4}>
      <Stack gap={1}>
        <HStack justify={'space-between'}>
          <Text textStyle={'text-medium-sm'} color="textPrimary">
            Started
          </Text>
          <Text textStyle={'text-medium-sm'} color="textPrimary">
            Ends
          </Text>
        </HStack>
        <ProgressBar percentage={progressPercentage} />
      </Stack>
      <HStack justify={'space-between'}>
        <Text
          textStyle={'text-medium-xs'}
          color="textPrimary"
          borderRadius={'redesign.md'}
          bg={'surfaceFifth'}
          px={2}
          py={1}
        >
          ~ {formatDateShort(approximateStartTimestamp)}
        </Text>
        <Text
          textStyle={'text-medium-xs'}
          color="textPrimary"
          borderRadius={'redesign.md'}
          bg={'surfaceFifth'}
          px={2}
          py={0.5}
        >
          ~ {formatDateShort(approximateEndTimestamp)}
        </Text>
      </HStack>
    </Stack>
  );
}

function BlockInfo({
  blockHeight,
  isActive = true,
  type,
}: {
  blockHeight: string;
  isActive?: boolean;
  type: 'bitcoin' | 'stacks';
}) {
  return (
    <HStack gap={1.5} px={1.5} py={1} borderRadius={'redesign.xs'} bg={'surfaceSecondary'}>
      <Icon
        w={3.5}
        h={3.5}
        aria-hidden="true"
        color={
          isActive
            ? type === 'bitcoin'
              ? 'accent.bitcoin-500'
              : 'accent.stacks-500'
            : { base: 'neutral.sand-400', _dark: 'neutral.sand-500' }
        }
      >
        {type === 'bitcoin' ? <BitcoinCircleIcon /> : <StxSquareIcon />}
      </Icon>
      <Text
        textStyle={'text-mono-xs'}
        color={isActive ? 'textPrimary' : 'textSecondary'}
        className={'block-height'}
        lineHeight={'redesign.normal'}
        aria-label={`Block height: ${blockHeight.replace('#', '')}`}
      >
        {blockHeight}
      </Text>
    </HStack>
  );
}

function BlocksSection() {
  const {
    stackingCycle: { startBlockHeight, endBlockHeight },
  } = useHomePageData();
  return (
    <HStack justify={'space-between'} align={'flex-start'}>
      <Flex gap={1.5} flexWrap={'wrap'}>
        <BlockInfo blockHeight={`~#${startBlockHeight}`} type="bitcoin" />
      </Flex>
      <Flex gap={1.5} flexWrap={'wrap'} justify={'flex-end'}>
        <BlockInfo blockHeight={`~#${endBlockHeight}`} type="bitcoin" />
      </Flex>
    </HStack>
  );
}

export function StackingSection() {
  return (
    <Stack gap={4} flex={1}>
      <Text whiteSpace={'nowrap'} textStyle="heading-md" color="textPrimary">
        Stacking
      </Text>
      <Stack borderRadius={'redesign.xl'} bg="surfacePrimary" px={[4, 6]} py={[5, 6]} gap={6}>
        <Stack gap={2.5}>
          <CycleHeader />
          <StxStats />
        </Stack>
        <Stack gap={3}>
          <CycleProgress />
          <BlocksSection />
        </Stack>
      </Stack>
    </Stack>
  );
}
