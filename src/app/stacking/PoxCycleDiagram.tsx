import { useSuspensePoxInfoRaw } from '@/common/queries/usePoxInforRaw';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { Grid } from '@/ui/Grid';
import { Icon } from '@/ui/Icon';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { VStack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

export const PoxCycleDiagram = () => {
  // const {
  //   nextRewardCycleId,
  //   preparePhaseBurnBlockHeightStart,
  //   rewardPhaseBurnBlockHeightStart,
  //   displayPreparePhaseInfo,
  //   approximateDaysTilNextCyclePreparePhase,
  //   approximateDaysTilNextCycleRewardPhase,
  // } = useSuspenseNextStackingCycle();

  const { data: poxInfo } = useSuspensePoxInfoRaw();
  // const nextCycleRewardPhaseBlockHeight = poxInfo.next_cycle.reward_phase_start_block_height;
  const preparePhaseBlockLength = poxInfo.prepare_phase_block_length;
  // const rewardPhaseBlockLength = poxInfo.reward_phase_block_length;
  // const prepareCycleLength = poxInfo.prepare_cycle_length;
  const rewardCycleLength = poxInfo.reward_cycle_length;
  // const preparePhaseStartBlockHeight = poxInfo.next_cycle.prepare_phase_start_block_height;
  // const blocksUntilPreparePhase = poxInfo.next_cycle.blocks_until_prepare_phase;
  const blocksUntilRewardPhase = poxInfo.next_cycle.blocks_until_reward_phase;
  // const rewardPhaseStartBlockHeight = poxInfo.next_cycle.reward_phase_start_block_height;
  // const nextRewardCycleIn = poxInfo.next_reward_cycle_in;

  // console.log({
  //   nextCycleRewardPhaseBlockHeight,
  //   preparePhaseBlockLength,
  //   rewardPhaseBlockLength,
  //   prepareCycleLength,
  //   rewardCycleLength,
  //   preparePhaseStartBlockHeight,
  //   blocksUntilPreparePhase,
  //   blocksUntilRewardPhase,
  //   rewardPhaseStartBlockHeight,
  //   nextRewardCycleIn,
  // });

  const cycleBlockLength = rewardCycleLength;
  const progressInBlocks = cycleBlockLength - 1 - blocksUntilRewardPhase; // Subtracting 1 because the last block of the prepare phase is actually the first block of the next cycle
  const progressPercentageForCurrentCycle = progressInBlocks / cycleBlockLength;
  const progressPercentageForNextCycle = blocksUntilRewardPhase === 0 ? 1 : 0;
  const prepareCycleProgress = (cycleBlockLength - preparePhaseBlockLength) / cycleBlockLength;

  return (
    <Grid templateColumns="2fr 1fr" w="full" h="full">
      <Stack bg="sand.150" w="full" alignItems="center" borderRadius="2xl" pl={8} py={6}>
        <Box w="full">
          <Flex pb={6} pr={8} justifyContent="space-between">
            <CycleInformation name="Current cycle" id={123} stxStacked={352735673} />
            <Flex
              gap={2}
              bg="sand.150"
              borderRadius="full"
              p={2}
              h="fit-content"
              border="1px solid var(--stacks-colors-sand-175)"
            >
              <Flex
                h={4}
                w={4}
                borderRadius="50%"
                bg="green.400"
                justifyContent="center"
                alignItems="center"
              >
                <Box h={2} w={2} borderRadius="50%" bg="green.600"></Box>
              </Flex>
              <Text whiteSpace="nowrap">Ends in 9 days</Text>
            </Flex>
          </Flex>
          <Box h={60} pt={6}>
            <CurrentCycleProgressBar
              start={{
                name: 'start',
                percentageMark: 0,
                bitcoinBlockNumber: 0,
                stacksBlockNumber: 0,
                date: new Date(),
              }}
              preparePhase={{
                name: 'prepare phase',
                percentageMark: prepareCycleProgress,
                bitcoinBlockNumber: 0,
                stacksBlockNumber: 0,
                date: new Date(),
              }}
              progressPercentage={progressPercentageForCurrentCycle}
            />
          </Box>
        </Box>
      </Stack>
      <Stack bg="sand.150" w="full" alignItems="center" borderRadius="2xl" pr={8} py={6}>
        <Box w="full">
          <Box pb={6} pl={8}>
            <CycleInformation name="Next cycle" id={123} stxStacked={352735673} />
          </Box>
          <Box h={60} pt={6}>
            <NextCycleProgressBar
              start={{
                name: 'start',
                percentageMark: 0,
                bitcoinBlockNumber: 0,
                stacksBlockNumber: 0,
                date: new Date(),
              }}
              progressPercentageForNextCycle={progressPercentageForNextCycle}
            />
          </Box>
        </Box>
      </Stack>
    </Grid>
  );
};

interface Section {
  name: string;
  percentageMark: number;
  bitcoinBlockNumber: number;
  stacksBlockNumber: number;
  date: Date;
}

const progressBarPadding = 1;
const progressBarPaddingWidth = progressBarPadding * 4;
const progressBarPointSize = 1;
const progressBarHeight = 2;

function CurrentCycleProgressBar({
  start,
  preparePhase,
  progressPercentage,
}: {
  start: Section;
  preparePhase: Section;
  progressPercentage: number;
}) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === progressBarRef.current) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    const currentProgressBarRef = progressBarRef.current;

    if (currentProgressBarRef) {
      resizeObserver.observe(currentProgressBarRef);
    }

    return () => {
      if (currentProgressBarRef) {
        resizeObserver.unobserve(currentProgressBarRef);
      }
    };
  }, []);

  return (
    <Stack gap={2}>
      <Flex className="top-text" position="relative" w="full" h={4}>
        <Box
          position="absolute"
          left={`${start.percentageMark * containerWidth + progressBarPaddingWidth}px`}
        >
          <Text fontSize="sm" whiteSpace="nowrap">
            Started
          </Text>
        </Box>
        <Box position="absolute" left={`${preparePhase.percentageMark * containerWidth}px`}>
          <Text fontSize="sm" whiteSpace="nowrap">
            Prepare Phase
          </Text>
        </Box>
      </Flex>
      <Box
        py={progressBarPadding}
        pl={progressBarPadding}
        borderStartRadius="full"
        bg="sand.175"
        position="relative"
        ref={progressBarRef}
        h={progressBarHeight}
        w="full"
      >
        <Box
          bg="brand"
          position="absolute"
          left={0}
          width={`${progressPercentage * containerWidth + progressBarPaddingWidth}px`}
          borderRadius="full"
          h="100%"
          top={0}
        />
        <Box
          position="absolute"
          left={`${preparePhase.percentageMark * containerWidth - progressBarPaddingWidth}px`}
          width={`${
            containerWidth -
            preparePhase.percentageMark * containerWidth +
            progressBarPaddingWidth * 2
          }px`} // progressBarPaddingWidth * 3 because we need to account for the padding for the dot plus the padding on the right and left sides
          borderStartRadius="full"
          h="100%"
          top={0}
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            #f0f0f0,
            #f0f0f0 10px,
            #e0e0e0 10px,
            #e0e0e0 20px
          )`,
          }}
        />
        <Box
          position="absolute"
          left={`${start.percentageMark * containerWidth + progressBarPaddingWidth}px`}
          top="50%"
          transform="translateY(-50%)"
          h={progressBarPointSize}
          w={progressBarPointSize}
          bg="white"
          borderRadius="full"
          zIndex="3"
        />
        <Box
          position="absolute"
          left={`${preparePhase.percentageMark * containerWidth}px`}
          top="50%"
          transform="translateY(-50%)"
          h={progressBarPointSize}
          w={progressBarPointSize}
          bg="black"
          borderRadius="full"
          zIndex="3"
        />
      </Box>
      <Flex className="bottom-text" position="relative" h={10}>
        <Stack
          gap={1}
          position="absolute"
          left={`${start.percentageMark * containerWidth + progressBarPaddingWidth}px`}
        >
          <Box bg="sand.200" p={1} borderRadius="full" w="fit-content">
            <Text color="sand.600" fontSize="xs">
              {start.date.toLocaleDateString()}
            </Text>
          </Box>
          <Text whiteSpace="nowrap" fontSize="xs">
            Bitcoin block {start.bitcoinBlockNumber}
          </Text>
          <Text whiteSpace="nowrap" fontSize="xs">
            Stacks block {start.stacksBlockNumber}
          </Text>
        </Stack>
        <Stack
          gap={1}
          position="absolute"
          left={`${preparePhase.percentageMark * containerWidth}px`}
        >
          <Box bg="sand.200" p={1} borderRadius="full" w="fit-content">
            <Text color="sand.600" fontSize="xs">
              {preparePhase.date.toLocaleDateString()}
            </Text>
          </Box>
          <Text whiteSpace="nowrap" fontSize="xs">
            Bitcoin block {preparePhase.bitcoinBlockNumber}
          </Text>
          <Text whiteSpace="nowrap" fontSize="xs">
            Stacks block {preparePhase.stacksBlockNumber}
          </Text>
        </Stack>
      </Flex>
    </Stack>
  );
}

function NextCycleProgressBar({
  start,
  progressPercentageForNextCycle,
}: {
  start: Section;
  progressPercentageForNextCycle: number;
}) {
  const nextCycleStartPercentage = 0.25; // magic number for setting the location of the dot indicating the start of the next cycle

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === progressBarRef.current) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    const currentProgressBarRef = progressBarRef.current;

    if (currentProgressBarRef) {
      resizeObserver.observe(currentProgressBarRef);
    }

    return () => {
      if (currentProgressBarRef) {
        resizeObserver.unobserve(currentProgressBarRef);
      }
    };
  }, []);

  return (
    <Stack gap={2}>
      <Flex className="top-text" position="relative" w="full" h={4}>
        <Box
          position="absolute"
          left={`${nextCycleStartPercentage * containerWidth + progressBarPaddingWidth}px`}
        >
          <Text fontSize="sm" whiteSpace="nowrap">
            Starts
          </Text>
        </Box>
      </Flex>
      <Box
        py={progressBarPadding}
        pl={progressBarPadding}
        borderEndRadius="full"
        bg="sand.175"
        position="relative"
        ref={progressBarRef}
        h={progressBarHeight}
        w="full"
      >
        <Box
          bg="brand"
          position="absolute"
          left={0}
          width={`${
            progressPercentageForNextCycle *
            (nextCycleStartPercentage * containerWidth +
              progressBarPaddingWidth * 2 +
              progressBarPointSize * 4)
          }px`} // progressBarPaddingWidth * 2 because we need to account for the padding the padding on the left side of the container plus to the right of the the dot
          borderEndRadius="full"
          h="100%"
          top={0}
          zIndex="2"
        />
        <Box
          position="absolute"
          left={0}
          width={`${
            nextCycleStartPercentage * containerWidth +
            progressBarPaddingWidth * 2 +
            progressBarPointSize * 4
          }px`} // progressBarPaddingWidth * 2 because we need to account for the padding the padding on the left side of the container plus to the right of the the dot
          borderEndRadius="full"
          h="100%"
          top={0}
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            #f0f0f0,
            #f0f0f0 10px,
            #e0e0e0 10px,
            #e0e0e0 20px
          )`,
          }}
        />
        <Box
          position="absolute"
          left={`${nextCycleStartPercentage * containerWidth + progressBarPaddingWidth}px`} // adding the progressBardPaddingWidth bc containerWidth does not include the container padding
          top="50%"
          transform="translateY(-50%)"
          h={progressBarPointSize}
          w={progressBarPointSize}
          bg="black"
          borderRadius="full"
          zIndex="3"
        />
        <Box
          position="absolute"
          right="0"
          top="0"
          bottom="0"
          zIndex="1000"
          width="20%"
          background="linear-gradient(to right, transparent, #EAE8E6)"
          pointerEvents="none"
        />
      </Box>
      <Flex className="bottom-text" position="relative" h={10}>
        <Stack
          gap={1}
          position="absolute"
          left={`${nextCycleStartPercentage * containerWidth + progressBarPaddingWidth}px`}
        >
          <Box bg="sand.200" p={1} borderRadius="full" fontSize="xs" w="fit-content">
            <Text color="sand.600" fontSize="xs">
              {start.date.toLocaleDateString()}
            </Text>
          </Box>
          <Text whiteSpace="nowrap" fontSize="xs">
            Bitcoin block {start.bitcoinBlockNumber}
          </Text>
          <Text whiteSpace="nowrap" fontSize="xs">
            Stacks block {start.stacksBlockNumber}
          </Text>
        </Stack>
      </Flex>
    </Stack>
  );
}

// Current Cycle Component
const CycleInformation = ({
  name = 'Current cycle',
  id = 123,
  stxStacked = 352735673,
}: {
  name: string;
  id: number;
  stxStacked: number;
}) => {
  return (
    <Flex w="full">
      <VStack align="start" gap={4} w="full">
        <Text fontSize="xl" fontWeight="400">
          {name}
        </Text>
        <Flex gap={2} alignItems="center" borderRadius="xl" bg="white" p={2}>
          <Text fontSize={40} fontWeight="400">
            {id}
          </Text>
          <Icon as={ArrowRight} size={6} weight="bold" />
        </Flex>
        <StackedStxMetric stxStacked={stxStacked} />
      </VStack>
    </Flex>
  );
};

const StackedStxMetric = ({ stxStacked }: { stxStacked: number }) => {
  const stackedStxString = stxStacked.toLocaleString();

  return (
    <Box whiteSpace="nowrap">
      <Text fontSize="xl" display="inline-flex">
        {`${stackedStxString} STX`}
      </Text>
      &nbsp;
      <Text as="span" fontSize="xl" fontWeight="bold" color="textSubdued" display="inline-flex">
        ($124.3M)
      </Text>
      &nbsp;
      <Text fontSize="xl" display="inline-flex">
        stacked
      </Text>
    </Box>
  );
};
