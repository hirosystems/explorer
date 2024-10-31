import { Flex } from '@/ui/Flex';
import { Icon } from '@/ui/Icon';
import BitcoinIcon from '@/ui/icons/BitcoinIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { useRef } from 'react';

import { Box } from '../../../ui/Box';
import { Stack } from '../../../ui/Stack';
import { Text } from '../../../ui/Text';
import useResizeObserver from '../useResizeObserver';
import { Section } from './HorizontalPoxCycleDiagram';
import {
  progressBarHeight,
  progressBarPadding,
  progressBarPaddingWidth,
  progressBarPointSize,
} from './consts';

export function CurrentCycleProgressBar({
  start,
  preparePhase,
  progressPercentage,
  progressBarBottom,
}: {
  start: Section;
  preparePhase: Section;
  progressPercentage: number;
  progressBarBottom: number;
}) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { width: progressBarWidth } = useResizeObserver(progressBarRef);

  return (
    <Box
      py={progressBarPadding}
      pl={progressBarPadding}
      borderStartRadius="full"
      bg="sand.175"
      position="absolute"
      ref={progressBarRef}
      h={progressBarHeight}
      w="full"
      bottom={`${progressBarBottom}px`}
      transform="translateY(100%)"
    >
      <Box
        left={`${start.percentageMark * progressBarWidth + progressBarPaddingWidth}px`}
        position="absolute"
        top={-4 + -2} // TODO: use vars
      >
        <Text fontSize="sm" whiteSpace="nowrap">
          Started
        </Text>
      </Box>
      <Box
        left={`${preparePhase.percentageMark * progressBarWidth - progressBarPaddingWidth}px`}
        position="absolute"
        top={-4 + -2} // TODO: use vars
      >
        <Text fontSize="sm" whiteSpace="nowrap">
          Prepare Phase
        </Text>
      </Box>
      <Box
        bg="brand"
        position="absolute"
        left={0}
        width={`${progressPercentage * progressBarWidth + progressBarPaddingWidth}px`}
        borderRadius="full"
        h="100%"
        top={0}
      />
      <Box
        position="absolute"
        left={`${preparePhase.percentageMark * progressBarWidth - progressBarPaddingWidth}px`}
        width={`${
          progressBarWidth -
          preparePhase.percentageMark * progressBarWidth +
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
        left={`${start.percentageMark * progressBarWidth + progressBarPaddingWidth}px`}
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
        left={`${preparePhase.percentageMark * progressBarWidth}px`}
        top="50%"
        transform="translateY(-50%)"
        h={progressBarPointSize}
        w={progressBarPointSize}
        bg="black"
        borderRadius="full"
        zIndex="3"
      />

      <Stack
        gap={1}
        position="absolute"
        left={`${start.percentageMark * progressBarWidth + progressBarPaddingWidth}px`}
        bottom={-2 + -15} // TODO: use vars
      >
        <Box bg="sand.200" p={1} borderRadius="full" w="fit-content">
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
      <Stack
        gap={1}
        position="absolute"
        left={`${preparePhase.percentageMark * progressBarWidth}px`}
        bottom={-2 + -15} // TODO: use vars
      >
        <Box bg="sand.200" p={1} borderRadius="full" w="fit-content">
          <Text color="sand.600" fontSize="xs">
            {preparePhase.date.toLocaleDateString()}
          </Text>
        </Box>
        <Flex gap={1}>
          <Icon as={BitcoinIcon} size={4} position={'relative'} bottom={'1px'} />
          <Text whiteSpace="nowrap" fontSize="xs">
            #{preparePhase.bitcoinBlockNumber}
          </Text>
        </Flex>
        {/* <Text whiteSpace="nowrap" fontSize="xs">
          Bitcoin block {preparePhase.bitcoinBlockNumber}
        </Text> */}
        <Flex gap={1}>
          <Icon as={StxIcon} size={4} position={'relative'} bottom={'1px'} />
          <Text whiteSpace="nowrap" fontSize="xs">
            #{preparePhase.stacksBlockNumber}
          </Text>
        </Flex>
        {/* <Text whiteSpace="nowrap" fontSize="xs">
          Stacks block {preparePhase.stacksBlockNumber}
        </Text> */}
      </Stack>
    </Box>
  );
}
