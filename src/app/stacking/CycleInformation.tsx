import { Flex } from '@/ui/Flex';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import { VStack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

// Current Cycle Component
export const CycleInformation = ({
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
    <Flex flexWrap="nowrap" alignItems="baseline">
      <Text fontSize="xl" whiteSpace="nowrap">
        {`${stackedStxString} STX`}
      </Text>
      &nbsp;
      <Text as="span" fontSize="xl" fontWeight="bold" color="textSubdued" whiteSpace="nowrap">
        ($124.3M)
      </Text>
      &nbsp;
      <Text fontSize="xl" whiteSpace="nowrap">
        stacked
      </Text>
    </Flex>
  );
};
