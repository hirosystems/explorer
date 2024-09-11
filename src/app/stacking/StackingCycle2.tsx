import { useSuspensePoxInfoRaw } from '@/common/queries/usePoxInforRaw';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { HStack } from '@/ui/HStack';
import { Text } from '@/ui/Text';
import { VStack } from '@chakra-ui/react';

import { useSuspenseNextStackingCycle } from '../_components/Stats/NextStackingCycle/useNextStackingCycle';

// Main Component
export const StackingCycle2 = () => {
  const {
    nextRewardCycleId,
    preparePhaseBurnBlockHeightStart,
    rewardPhaseBurnBlockHeightStart,
    displayPreparePhaseInfo,
    approximateDaysTilNextCyclePreparePhase,
    approximateDaysTilNextCycleRewardPhase,
  } = useSuspenseNextStackingCycle();

  const { data: poxInfo } = useSuspensePoxInfoRaw();
  const nextCycleRewardPhaseBlockHeight = poxInfo.next_cycle.reward_phase_start_block_height;
  const preparePhaseBlockLength = poxInfo.prepare_phase_block_length;
  const rewardPhaseBlockLength = poxInfo.reward_phase_block_length;
  const prepareCycleLength = poxInfo.prepare_cycle_length;
  const rewardCycleLength = poxInfo.reward_cycle_length;
  const preparePhaseStartBlockHeight = poxInfo.next_cycle.prepare_phase_start_block_height;
  const blocksUntilPreparePhase = poxInfo.next_cycle.blocks_until_prepare_phase;
  const blocksUntilRewardPhase = poxInfo.next_cycle.blocks_until_reward_phase;
  const reward_phase_start_block_height = poxInfo.next_cycle.reward_phase_start_block_height;
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
    reward_phase_start_block_height,
    rewardPhaseStartBlockHeight,
    nextRewardCycleIn,
  });
  // Ideally I can get the length of the cycle in blocks, then calculate progress by the number of blocks left until the next reward phase

  return (
    <Flex bg="white" p={6} borderRadius="lg" boxShadow="lg" position="relative" overflow="hidden">
      <Box w="full">
        <CycleProgressBar
          sections={[
            { name: 'start', percentageMark: 0 },
            { name: 'prepare phase', percentageMark: 75 },
            { name: 'next reward phase', percentageMark: 100 },
          ]}
        />
      </Box>
      {/* <NextCycle /> */}
    </Flex>
  );
};

interface Section {
  name: string;
  percentageMark: number;
}

function CycleProgressBar({ sections }: { sections: Section[] }) {
  return (
    <Box p={3} borderRadius="full" bg="gray" position="relative">
      {/* {sections.map(section => {
        return (
          <Box
            position="absolute"
            key={section.name}
            h={2}
            w={2}
            bg="purple.500"
            borderRadius="full"
            width={`${section.percentageMark}%`}
          />
        );
      })} */}
      {sections.map(section => {
        return (
          <Box
            position="absolute"
            right="-4px"
            top="50%"
            transform="translateY(-50%)"
            h={2}
            w={2}
            bg="white"
            borderRadius="full"
            border="3px solid purple.500"
          />
        );
      })}
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
