import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { Grid } from '@/ui/Grid';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { useEffect, useRef, useState } from 'react';

import { CycleInformation } from './CycleInformation';
import { PoxCycleInfo } from './usePoxCycle';

export const HorizontalPoxCycleDiagram = ({ data }: { data: PoxCycleInfo }) => {
  const {
    currentCycleId,
    prepareCycleProgress,
    progressPercentageForCurrentCycle,
    progressPercentageForNextCycle,
    nextCycleId,
    currentCycleStackedStx,
    nextCycleStackedStx,
    currentBlockDate,
    preparePhaseDate,
    currentCycleBurnChainBlockHeightStart,
    preparePhaseBurnBlockHeightStart,
    rewardPhaseBurnBlockHeightStart,
    approximateNextCycleDate,
  } = data;
  return (
    <Grid templateColumns="2fr 1fr" w="full" h="full">
      <Stack bg="sand.150" w="full" alignItems="center" borderRadius="2xl" pl={8} py={6}>
        <Box w="full">
          <Flex pb={6} pr={8} justifyContent="space-between">
            <CycleInformation
              name="Current cycle"
              id={currentCycleId}
              stxStacked={currentCycleStackedStx}
            />
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
          </Box>
        </Box>
      </Stack>
      <Stack bg="sand.150" w="full" alignItems="center" borderRadius="2xl" pr={8} py={6}>
        <Box w="full">
          <Box pb={6} pl={8}>
            <CycleInformation name="Next cycle" id={nextCycleId} stxStacked={nextCycleStackedStx} />
          </Box>
          <Box h={60} pt={6}>
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
