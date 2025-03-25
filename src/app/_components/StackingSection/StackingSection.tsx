import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import BitcoinCircleIcon from '@/ui/icons/BitcoinCircleIcon';
import ProgressDot from '@/ui/icons/ProgressDot';
import StxIcon from '@/ui/icons/StxIcon';
import StxSquareIcon from '@/ui/icons/StxSquareIcon';
import { Box, BoxProps, Flex, HStack, Icon, Stack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

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
  return (
    <Stack gap="3">
      <HStack justify={'space-between'} align={'flex-start'}>
        <Text textStyle={'heading-xs'}>Current cycle</Text>

        <HStack
          borderRadius={'redesign.lg'}
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
          <Text textStyle={'heading-xs'}>Ends in 9 days</Text>
        </HStack>
      </HStack>
      <HStack
        borderRadius={'redesign.2xl'}
        gap={1.5}
        color="textPrimary"
        bg="surfaceTertiary"
        px="4"
        py="2"
        width="fit-content"
      >
        <Text textStyle={'heading-lg'} lineHeight={'redesign.none'}>
          123
        </Text>
        <Icon w="6" h="6">
          <ArrowRight />
        </Icon>
      </HStack>
    </Stack>
  );
}

function StxStats() {
  return (
    <HStack color="textPrimary">
      <Icon w="4.5" h="4.5">
        <StxIcon />
      </Icon>
      <Text whiteSpace={'nowrap'} textStyle={['heading-xs', 'heading-sm']}>
        451,363,561 STX{' '}
        <Text color="textSecondary" display={'inline'}>
          / $1.1M
        </Text>{' '}
        stacked
      </Text>
    </HStack>
  );
}

function CycleProgress() {
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
        <ProgressBar percentage={50} />
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
          5 Sept.
        </Text>
        <Text
          textStyle={'text-medium-xs'}
          color="textPrimary"
          borderRadius={'redesign.md'}
          bg={'surfaceFifth'}
          px={2}
          py={0.5}
        >
          12 Sept.
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
  return (
    <HStack justify={'space-between'} align={'flex-start'}>
      <Flex gap={1.5} flexWrap={'wrap'}>
        <BlockInfo blockHeight="#2222222" type="bitcoin" />
        <BlockInfo blockHeight="#1111111" type="stacks" />
      </Flex>
      <Flex gap={1.5} flexWrap={'wrap'} justify={'flex-end'}>
        <BlockInfo blockHeight="#2222222" type="bitcoin" isActive={false} />
        <BlockInfo blockHeight="#1111111" type="stacks" isActive={false} />
      </Flex>
    </HStack>
  );
}

export function StackingSection() {
  return (
    <Stack borderRadius={'redesign.xl'} w="100%" bg="surfacePrimary" p="6" gap={6}>
      <Stack gap="4">
        <CycleHeader />
        <StxStats />
      </Stack>
      <Stack gap={4}>
        <CycleProgress />
        <BlocksSection />
      </Stack>
    </Stack>
  );
}
