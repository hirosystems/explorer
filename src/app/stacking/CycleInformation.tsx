import { Text } from '@/ui/Text';
import { Box, Flex, Icon, Stack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

function CountdownBadge({ daysLeft }: { daysLeft: number }) {
  const outerDotRef = useRef<HTMLDivElement>(null);
  const middleDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(middleDotRef.current, {
      keyframes: {
        opacity: [0.2, 1, 0.2],
        scale: [0.7, 1, 0.7],
      },
      duration: 3,
      delay: 0,
      repeat: -1,
    });

    tl.to(outerDotRef.current, {
      keyframes: {
        opacity: [0.2, 1, 0.2],
        scale: [0.7, 1, 0.7],
      },
      duration: 3,
      delay: 0.8,
      repeat: -1,
    });

    return () => {
      tl.kill(); // Clean up the animation when the component unmounts
    };
  }, []);

  return (
    <Flex
      gap={2}
      bg="sand.150"
      borderRadius="full"
      p={2}
      border="1px solid var(--stacks-colors-sand-175)"
      alignItems="center"
    >
      <Flex justifyContent="center" alignItems="center" h={4} w={4} position="relative">
        <Box
          ref={outerDotRef}
          position="absolute"
          h="14px"
          w="14px"
          bg="rgba(48, 164, 108, 0.30)"
          borderRadius="full"
        />
        <Box
          ref={middleDotRef}
          position="absolute"
          h="6px"
          w="6px"
          bg="#30A46C"
          borderRadius="full"
        />
      </Flex>
      <Text whiteSpace="nowrap">Ends in {daysLeft} days</Text>
    </Flex>
  );
}

type CycleType = 'current' | 'next';

// Current Cycle Component
export const CycleInformation = ({
  name = 'Current cycle',
  id = 123,
  stxStacked = 352735673,
  cycleType,
}: {
  name: string;
  id: number;
  stxStacked: number;
  cycleType: CycleType;
}) => {
  return (
    <Flex w="full">
      <Stack align="start" gap={4} w="full">
        <Flex justifyContent="space-between" w="full" h={10}>
          <Text fontSize="xl" fontWeight="400">
            {name}
          </Text>
          {cycleType === 'current' && <CountdownBadge daysLeft={9} />}
        </Flex>
        <Flex gap={2} alignItems="center" borderRadius="xl" bg="white" p={2}>
          <Text fontSize={40} fontWeight="400">
            {id}
          </Text>
          <Icon h={6} w={6} color="iconPrimary">
            <ArrowRight weight="bold" />
          </Icon>
        </Flex>
        <StackedStxMetric stxStacked={stxStacked} />
      </Stack>
    </Flex>
  );
};

const StackedStxMetric = ({ stxStacked }: { stxStacked: number }) => {
  const stackedStxString = stxStacked.toLocaleString();

  return (
    <Flex flexWrap="wrap" alignItems="baseline">
      <Text fontSize="xl" whiteSpace="nowrap">
        {`${stackedStxString} STX`}
      </Text>
      &nbsp;
      <Text fontSize="xl" fontWeight="bold" color="textSubdued" whiteSpace="nowrap">
        ($124.3M)
      </Text>
      &nbsp;
      <Text fontSize="xl" whiteSpace="nowrap">
        stacked
      </Text>
    </Flex>
  );
};
