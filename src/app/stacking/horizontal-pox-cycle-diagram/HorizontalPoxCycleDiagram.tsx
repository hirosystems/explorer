import { useEffect, useRef, useState } from 'react';

import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { Stack } from '../../../ui/Stack';
import { CycleInformation } from '../CycleInformation';
import { PoxCycleInfo } from '../usePoxCycle';
import { useResizeObserver } from '../useResizeObserver';
import { CurrentCycleProgressBar } from './CurrentCycleProgressBar';
import { NextCycleProgressBar } from './NextCycleProgressBar';

const sizePadding = 4;
const progressBarSize = 2 + 2 + 2 + 15 + 4;
const size = sizePadding * 2 + progressBarSize;

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

  const currentCycleProgressBarBlockRef = useRef<HTMLDivElement>(null);
  const { height: currentCycleProgressBarBlockHeight } = useResizeObserver(
    currentCycleProgressBarBlockRef
  );
  console.log({ currentCycleProgressBarBlockHeight });

  const nextCycleProgressBarBlockRef = useRef<HTMLDivElement>(null);
  const { height: nextCycleProgressBarBlockHeight } = useResizeObserver(
    nextCycleProgressBarBlockRef
  );
  console.log({ nextCycleProgressBarBlockHeight });

  const [progressBarBottom, setProgressBarBottom] = useState(
    Math.min(currentCycleProgressBarBlockHeight, nextCycleProgressBarBlockHeight) / 2
  );

  useEffect(() => {
    setProgressBarBottom(
      Math.min(currentCycleProgressBarBlockHeight, nextCycleProgressBarBlockHeight) / 2
    );
  }, [currentCycleProgressBarBlockHeight, nextCycleProgressBarBlockHeight]);

  console.log({ progressBarBottom });

  return (
    <Grid templateColumns="2fr 1fr" w="full" h="full" className="pox-cycle-diagram">
      <Stack bg="sand.150" w="full" alignItems="center" borderRadius="2xl" pl={8} py={6}>
        <Stack w="full" h="full" className="cycle-section-container">
          <Flex pr={8}>
            <CycleInformation
              name="Current cycle"
              id={currentCycleId}
              stxStacked={currentCycleStackedStx}
              cycleType="current"
            />
          </Flex>
          <Stack
            ref={currentCycleProgressBarBlockRef}
            className="current-cycle-progress-bar-container"
            h={size * 4}
            flexGrow={1}
            position="relative"
            w="full"
          >
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
              progressBarBottom={progressBarBottom}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack bg="sand.150" w="full" alignItems="center" borderRadius="2xl" pr={8} py={6}>
        <Stack w="full" h="full">
          <Box pl={8}>
            <CycleInformation
              name="Next cycle"
              id={nextCycleId}
              stxStacked={nextCycleStackedStx}
              cycleType="next"
            />
          </Box>
          <Stack
            ref={nextCycleProgressBarBlockRef}
            className="next-cycle-progress-container"
            h={size * 4}
            flexGrow={1}
            position="relative"
            w="full"
          >
            <NextCycleProgressBar
              start={{
                name: 'start',
                percentageMark: 0,
                bitcoinBlockNumber: rewardPhaseBurnBlockHeightStart,
                stacksBlockNumber: 0,
                date: approximateNextCycleDate,
              }}
              progressPercentageForNextCycle={progressPercentageForNextCycle}
              progressBarBottom={progressBarBottom}
            />
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  );
};

export interface Section {
  name: string;
  percentageMark: number;
  bitcoinBlockNumber: number;
  stacksBlockNumber: number;
  date: Date;
}
