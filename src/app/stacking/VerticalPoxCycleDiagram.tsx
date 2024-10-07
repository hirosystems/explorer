import { useEffect, useRef, useState } from 'react';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';
import { CycleInformation } from './CycleInformation';
import { PoxCycleInfo } from './usePoxCycle';

export const VerticalPoxCycleDiagram = ({ data }: { data: PoxCycleInfo }) => {
  const {
    currentCycleId,
    currentCycleStackedStx,
    currentCycleBurnChainBlockHeightStart,
    currentBlockDate,
    prepareCycleProgress,
    preparePhaseBurnBlockHeightStart,
    preparePhaseDate,
    progressPercentageForCurrentCycle,
    rewardPhaseBurnBlockHeightStart,
    approximateNextCycleDate,
    progressPercentageForNextCycle,
  } = data;

  return (
    <Stack bg="sand.150" w="full" alignItems="center" borderRadius="2xl" pl={8} py={6}>
      <Box w="full">
        <Flex pb={6} pr={8} justifyContent="space-between">
          <CycleInformation
            name="Current cycle"
            id={currentCycleId}
            stxStacked={currentCycleStackedStx}
          />
        </Flex>
        <Box pt={6}>
          <CurrentCycleProgressBar
            start={{
              name: 'start',
              percentageMark: 0,
              bitcoinBlockNumber: currentCycleBurnChainBlockHeightStart,
              stacksBlockNumber: 0,
              date: currentBlockDate || new Date(),
            }}
            preparePhase={{
              name: 'prepare phase',
              percentageMark: prepareCycleProgress,
              bitcoinBlockNumber: preparePhaseBurnBlockHeightStart,
              stacksBlockNumber: 0,
              date: preparePhaseDate,
            }}
            progressPercentage={progressPercentageForCurrentCycle}
          />
          <NextCycleProgressBar
            start={{
              name: 'start',
              percentageMark: 0,
              bitcoinBlockNumber: rewardPhaseBurnBlockHeightStart,
              stacksBlockNumber: 0,
              date: approximateNextCycleDate,
            }}
            progressPercentageForNextCycle={progressPercentageForNextCycle}
          />
        </Box>
      </Box>
    </Stack>
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
const currentCycleProgressBarHeight = '300px';
const nextCycleProgressBarHeight = '100px';
const progressBarWidth = 2;
const textLeftOffset = 5;

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
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === progressBarRef.current) {
          setContainerHeight(entry.contentRect.height);
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
    <Box position="relative" h={currentCycleProgressBarHeight}>
      <Box
        px={progressBarPadding}
        pt={progressBarPadding}
        borderTopRadius="full"
        bg="sand.175"
        position="relative"
        ref={progressBarRef}
        h={currentCycleProgressBarHeight}
        w={progressBarWidth}
      >
        <Box
          bg="brand"
          position="absolute"
          top={0}
          left={0}
          h={`${progressPercentage * containerHeight + progressBarPaddingWidth}px`}
          w="full"
          borderRadius="full"
        />
        <Box
          position="absolute"
          top={`${preparePhase.percentageMark * containerHeight - progressBarPaddingWidth}px`}
          left={0}
          h={`${
            containerHeight -
            preparePhase.percentageMark * containerHeight +
            progressBarPaddingWidth * 2
          }px`} // progressBarPaddingWidth * 3 because we need to account for the padding for the dot plus the padding on the right and left sides
          w="full"
          borderTopRadius="full"
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
          top={`${start.percentageMark * containerHeight + progressBarPaddingWidth}px`}
          left="50%"
          transform="translateX(-50%)"
          bg="white"
          h={progressBarPointSize}
          w={progressBarPointSize}
          borderRadius="full"
          zIndex="3"
        />
        <Box
          position="absolute"
          top={`${preparePhase.percentageMark * containerHeight}px`}
          left="50%"
          transform="translateX(-50%)"
          bg="black"
          h={progressBarPointSize}
          w={progressBarPointSize}
          borderRadius="full"
          zIndex="3"
        />
      </Box>
      <Stack
        position="absolute"
        top={`${
          start.percentageMark * containerHeight +
          progressBarPaddingWidth -
          progressBarPointSize * 4
        }px`}
        left={textLeftOffset}
        gap={1}
      >
        <Text fontSize="sm" whiteSpace="nowrap">
          Started
        </Text>
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
        position="absolute"
        top={`${preparePhase.percentageMark * containerHeight - progressBarPointSize * 4}px`}
        left={textLeftOffset}
        gap={1}
      >
        <Text fontSize="sm" whiteSpace="nowrap" position="relative">
          Prepare Phase
        </Text>
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
    </Box>
  );
}

function NextCycleProgressBar({
  start,
  progressPercentageForNextCycle,
}: {
  start: Section;
  progressPercentageForNextCycle: number;
}) {
  console.log('NextCycleProgressBar', { start });
  const nextCycleStartPercentage = 0.25; // magic number for setting the location of the dot indicating the start of the next cycle

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === progressBarRef.current) {
          setContainerHeight(entry.contentRect.width);
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
    <Box position="relative" h={nextCycleProgressBarHeight}>
      <Box
        position="relative"
        py={progressBarPadding}
        pl={progressBarPadding}
        borderBottomRadius="full"
        bg="sand.175"
        ref={progressBarRef}
        h={nextCycleProgressBarHeight}
        w={progressBarWidth}
      >
        <Box
          bg="brand"
          position="absolute"
          top={0}
          left={0}
          h={`${
            progressPercentageForNextCycle *
            (nextCycleStartPercentage * containerHeight +
              progressBarPaddingWidth * 2 +
              progressBarPointSize * 4)
          }px`} // progressBarPaddingWidth * 2 because we need to account for the padding the padding on the left side of the container plus to the right of the the dot
          borderBottomRadius="full"
          w="full"
          zIndex="2"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          h={`${
            nextCycleStartPercentage * containerHeight +
            progressBarPaddingWidth * 2 +
            progressBarPointSize * 4
          }px`} // progressBarPaddingWidth * 2 because we need to account for the padding the padding on the left side of the container plus to the right of the the dot
          borderBottomRadius="full"
          w="full"
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
          top={`${nextCycleStartPercentage * containerHeight + progressBarPaddingWidth}px`} // adding the progressBardPaddingWidth bc containerWidth does not include the container padding
          left="50%"
          transform="translateX(-50%)"
          bg="black"
          h={progressBarPointSize}
          w={progressBarPointSize}
          borderRadius="full"
          zIndex="3"
        />
        <Box
          position="absolute"
          className="pinky"
          bottom={0}
          right={0}
          left={0}
          zIndex="1000"
          h="20%"
          w="full"
          bg="linear-gradient(to bottom, transparent, #EAE8E6)"
          pointerEvents="none"
        />
      </Box>
      <Stack
        position="absolute"
        top={`${
          nextCycleStartPercentage * containerHeight +
          progressBarPaddingWidth -
          progressBarPointSize * 4
        }px`}
        left={textLeftOffset}
        gap={1}
      >
        <Text fontSize="sm" whiteSpace="nowrap">
          Starts
        </Text>
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
    </Box>
  );
}
