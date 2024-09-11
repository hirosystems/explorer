import { useSuspensePoxInfoRaw } from '@/common/queries/usePoxInforRaw';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { HStack } from '@/ui/HStack';
import { Text } from '@/ui/Text';
import { VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

// Main Component
export const StackingCycle2 = () => {
  // const {
  //   nextRewardCycleId,
  //   preparePhaseBurnBlockHeightStart,
  //   rewardPhaseBurnBlockHeightStart,
  //   displayPreparePhaseInfo,
  //   approximateDaysTilNextCyclePreparePhase,
  //   approximateDaysTilNextCycleRewardPhase,
  // } = useSuspenseNextStackingCycle();

  const { data: poxInfo } = useSuspensePoxInfoRaw();
  const nextCycleRewardPhaseBlockHeight = poxInfo.next_cycle.reward_phase_start_block_height;
  const preparePhaseBlockLength = poxInfo.prepare_phase_block_length;
  const rewardPhaseBlockLength = poxInfo.reward_phase_block_length;
  const prepareCycleLength = poxInfo.prepare_cycle_length;
  const rewardCycleLength = poxInfo.reward_cycle_length;
  const preparePhaseStartBlockHeight = poxInfo.next_cycle.prepare_phase_start_block_height;
  const blocksUntilPreparePhase = poxInfo.next_cycle.blocks_until_prepare_phase;
  const blocksUntilRewardPhase = poxInfo.next_cycle.blocks_until_reward_phase;
  const rewardPhaseStartBlockHeight = poxInfo.next_cycle.reward_phase_start_block_height;
  const nextRewardCycleIn = poxInfo.next_reward_cycle_in;

  console.log({
    nextCycleRewardPhaseBlockHeight,
    preparePhaseBlockLength,
    rewardPhaseBlockLength,
    prepareCycleLength,
    rewardCycleLength,
    preparePhaseStartBlockHeight,
    blocksUntilPreparePhase,
    blocksUntilRewardPhase,
    rewardPhaseStartBlockHeight,
    nextRewardCycleIn,
  });
  // Ideally I can get the length of the cycle in blocks, then calculate progress by the number of blocks left until the next reward phase

  const cycleBlockLength = rewardCycleLength;
  const progressInBlocks = cycleBlockLength - blocksUntilRewardPhase;
  const progressPercentage = progressInBlocks / cycleBlockLength;
  const prepareCycleProgress = (cycleBlockLength - preparePhaseBlockLength) / cycleBlockLength;

  console.log({
    cycleBlockLength,
    progressInBlocks,
    progressPercentage,
    prepareCycleProgress,
  });

  return (
    <Flex
      bg="white"
      py={6}
      pl={6}
      borderRadius="lg"
      boxShadow="lg"
      position="relative"
      overflow="hidden"
    >
      <Flex bg="sand.500" h={200} w="full" alignItems="center">
        <Box w="full">
          <CurrentCycleProgressBar
            start={{ name: 'start', percentageMark: 0 }}
            preparePhase={{ name: 'prepare phase', percentageMark: prepareCycleProgress }}
            progressPercentage={progressPercentage}
          />
        </Box>
      </Flex>

      {/* <NextCycle /> */}
    </Flex>
  );
};

interface Section {
  name: string;
  percentageMark: number;
}

const progressBarPadding = 1;
const progressBarPaddingWidth = progressBarPadding * 4;

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

  console.log({
    containerWidth,
    'preparePhase.percentageMark * containerWidth': preparePhase.percentageMark * containerWidth,
  });

  return (
    <Box>
      <Flex className="top-text" position="relative" w="full" h={4}>
        <Box
          position="absolute"
          left={`${start.percentageMark * containerWidth + progressBarPaddingWidth}px`}
        >
          <Text>Start</Text>
        </Box>
        <Box position="absolute" left={`${preparePhase.percentageMark * containerWidth}px`}>
          <Text>Prepare Phase</Text>
        </Box>
      </Flex>
      <Box
        py={progressBarPadding}
        pl={progressBarPadding}
        // borderRadius="full"
        borderStartRadius="full"
        bg="sand.400"
        position="relative"
        ref={progressBarRef}
        h={4}
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
          bg="brand"
          position="absolute"
          left={`${preparePhase.percentageMark * containerWidth - progressBarPaddingWidth}px`}
          width={`${
            containerWidth -
            preparePhase.percentageMark * containerWidth +
            progressBarPaddingWidth * 2
          }px`} // progressBarPaddingWidth * 3 because we need to account for the padding for the dot plus the padding on the right and left sides
          // borderRadius="full"
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
          h={2}
          w={2}
          bg="white"
          borderRadius="full"
        />
        <Box
          position="absolute"
          left={`${preparePhase.percentageMark * containerWidth}px`}
          top="50%"
          transform="translateY(-50%)"
          h={2}
          w={2}
          bg="white"
          borderRadius="full"
        />
      </Box>
      <Flex className="bottom-text" position="relative" h={10}>
        <Box
          position="absolute"
          left={`${start.percentageMark * containerWidth + progressBarPaddingWidth}px`}
        >
          <Text>Start</Text>
          <Text>Bitcoin block</Text>
          <Text>Stacks block</Text>
        </Box>
        <Box position="absolute" left={`${preparePhase.percentageMark * containerWidth}px`}>
          <Text>Prepare Phase</Text>
          <Text>Bitcoin block</Text>
          <Text>Stacks block</Text>
        </Box>
      </Flex>
    </Box>
  );
}

// Rewards Component
const CycleRewards = () => {
  return (
    <VStack align="start">
      <Text fontSize="xl" fontWeight="bold">
        Stackers have earned
      </Text>
      <Text fontSize="3xl" fontWeight="bold">
        142,532 BTC
        <Text as="span" fontSize="lg" color="gray.500">
          ($8.4M)
        </Text>
      </Text>
      <Text fontSize="lg" color="gray.500">
        in rewards ✨
      </Text>
    </VStack>
  );
};

const CycleDiagram = () => {
  return (
    <Box position="relative" flex="1" width="100%" className="diagram">
      <CurrentCycle />
    </Box>
  );
};

const progressBarHeight = 6;

// Current Cycle Component
const CurrentCycle = () => {
  return (
    <Flex
      w="full"
      p={2}
      border="1px solid var(--stacks-colors-purple-300)"
      backgroundColor="purple.100"
      borderRadius="md"
    >
      <VStack align="start" spacing={4} w="full" p={4}>
        <Text fontSize="lg" color="gray.500">
          Current cycle
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          #123
        </Text>
        <StackedStxMetric stackedStx={352735673} />
        <Box position="relative" h={progressBarHeight} w="full" className="pb-positioner">
          <Box position="absolute" h="full" w="full" className="progress-bar-container">
            <CustomProgressBar />
          </Box>
        </Box>

        {/* <CustomProgressBar /> */}
        {/* <HStack spacing={2}>
          <Badge colorScheme="gray">Started</Badge>
          <Text fontSize="sm" color="gray.500">
            2 days ago
          </Text>
        </HStack> */}
        {/* <BlockInfo /> */}
      </VStack>
      <NextCycle />
    </Flex>
  );
};

const StackedStxMetric = ({ stackedStx }: { stackedStx: number }) => {
  const stackedStxString = stackedStx.toLocaleString();

  return (
    <Box>
      <Text fontSize="lg" color="gray.500" display="inline-flex">
        {`${stackedStxString} STX`}
      </Text>
      &nbsp;
      <Text as="span" fontWeight="bold" color="textSubdued" display="inline-flex">
        ($124.3M)
      </Text>
      &nbsp;
      <Text fontSize="lg" color="gray.500" display="inline-flex">
        stacked
      </Text>
    </Box>
  );
};

// Next Cycle Component
const NextCycle = () => {
  return (
    <VStack
      align="start"
      spacing={4}
      w="full"
      position="relative"
      border="1px solid var(--stacks-colors-purple-500)"
      p={4}
      borderRadius="md"
      backgroundColor="purple.200"
    >
      <Text fontSize="lg" color="gray.500">
        Next cycle
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        #124
      </Text>
      <StackedStxMetric stackedStx={124532235} />
      {/* <Box w="full" mt={6}>
        <CustomProgressBar />
      </Box> */}
      {/* <HStack spacing={2}>
        <Badge colorScheme="gray">Starts</Badge>
        <Text fontSize="sm" color="gray.500">
          in 8 days
        </Text>
      </HStack> */}
      {/* <BlockInfo /> */}
    </VStack>
  );
};

// Custom Progress Bar Component
const CustomProgressBar = () => {
  return (
    <Box p={3} borderRadius="full" bg="orange.400">
      <Flex w="full" h="6px" bg="gray.100" borderRadius="full">
        {/* First Segment */}
        <Box position="relative" h="6px" bg="purple.500" borderRadius="full" width="70%" />
        {/* Second Segment (Prepare Phase) */}
        <Box
          position="relative"
          h="6px"
          bg="purple.200"
          borderRadius="full"
          width="15%"
          left="70%"
          borderRight="2px dashed purple.500"
          zIndex="1"
        />
        {/* Third Segment */}
        <Box position="relative" h="6px" bg="gray.100" borderRadius="full" width="15%" left="85%" />
        {/* Labels */}
        {/* <Flex justifyContent="space-between" position="absolute" top="-20px" w="full">
        <Text fontSize="xs" color="gray.500" ml="2">
          STARTED
        </Text>
        <Text fontSize="xs" color="gray.500" textAlign="center" width="15%">
          PREPARE PHASE
        </Text>
        <Text fontSize="xs" color="gray.500" mr="2" textAlign="right">
          STARTS
        </Text>
      </Flex> */}
      </Flex>
    </Box>
  );
};

// Block Information Component
const BlockInfo = () => {
  return (
    <VStack align="start" spacing={1} pt={2}>
      <HStack spacing={1}>
        <Text fontSize="xs" color="gray.500">
          Bitcoin block #
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          42946
        </Text>
      </HStack>
      <HStack spacing={1}>
        <Text fontSize="xs" color="gray.500">
          Stacks block #
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          735,863
        </Text>
      </HStack>
    </VStack>
  );
};
