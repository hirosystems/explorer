import { Text } from '@/ui/Text';
import BitcoinIcon from '@/ui/icons/BitcoinIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { Box, Flex, Icon, Stack } from '@chakra-ui/react';
import { useRef } from 'react';

import useResizeObserver from '../useResizeObserver';
import { Section } from './HorizontalPoxCycleDiagram';
import {
  progressBarHeight,
  progressBarPadding,
  progressBarPaddingWidth,
  progressBarPointSize,
} from './consts';

export function NextCycleProgressBar({
  start,
  progressPercentageForNextCycle,
  progressBarBottom,
}: {
  start: Section;
  progressPercentageForNextCycle: number;
  progressBarBottom: number;
}) {
  const nextCycleStartPercentage = 0.25; // magic number for setting the location of the dot indicating the start of the next cycle

  const progressBarRef = useRef<HTMLDivElement>(null);
  const { width: progressBarWidth } = useResizeObserver(progressBarRef);

  return (
    <Box
      py={progressBarPadding}
      pl={progressBarPadding}
      borderEndRadius="full"
      bg="sand.175"
      position="absolute"
      ref={progressBarRef}
      h={progressBarHeight}
      w="full"
      bottom={`${progressBarBottom}px`}
      transform="translateY(100%)"
    >
      <Box
        position="absolute"
        left={`${nextCycleStartPercentage * progressBarWidth + progressBarPaddingWidth}px`}
        top={-4 + -2} // TODO: use vars
      >
        <Text fontSize="sm" whiteSpace="nowrap">
          Starts
        </Text>
      </Box>
      <Box
        bg="brand"
        position="absolute"
        left={0}
        width={`${
          progressPercentageForNextCycle *
          (nextCycleStartPercentage * progressBarWidth +
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
          nextCycleStartPercentage * progressBarWidth +
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
        left={`${nextCycleStartPercentage * progressBarWidth + progressBarPaddingWidth}px`} // adding the progressBardPaddingWidth bc containerWidth does not include the container padding
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
      <Stack
        gap={1}
        position="absolute"
        left={`${nextCycleStartPercentage * progressBarWidth + progressBarPaddingWidth}px`}
        bottom={-2 + -15} // TODO: use vars
        className="next-cycle-bottom-text"
      >
        <Box bg="sand.200" p={1} borderRadius="full" fontSize="xs" w="fit-content">
          <Text color="sand.600" fontSize="xs">
            {start.date.toLocaleDateString()}
          </Text>
        </Box>
        <Flex gap={1}>
          <Icon as={BitcoinIcon} size={4} position={'relative'} bottom={'1px'} />
          <Text whiteSpace="nowrap" fontSize="xs">
            #{start.bitcoinBlockNumber}
          </Text>
        </Flex>
        {/* <Text whiteSpace="nowrap" fontSize="xs">
          Bitcoin block {start.bitcoinBlockNumber}
        </Text> */}
        <Flex gap={1}>
          <Icon as={StxIcon} size={4} position={'relative'} bottom={'1px'} />
          <Text whiteSpace="nowrap" fontSize="xs">
            #{start.stacksBlockNumber}
          </Text>
        </Flex>
        {/* <Text whiteSpace="nowrap" fontSize="xs">
          Stacks block {start.stacksBlockNumber}
        </Text> */}
      </Stack>
    </Box>
  );
}
