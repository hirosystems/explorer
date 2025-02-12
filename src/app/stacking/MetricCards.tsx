import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { Info } from '@phosphor-icons/react';

import { Card } from '../../common/components/Card';

const MetricCard = ({
  title,
  primaryMetric,
  secondaryMetric,
}: {
  title: string;
  primaryMetric: string;
  secondaryMetric: string;
}) => {
  return (
    <Card bg="sand.150" p={2} h="fit-content" w="fit-content">
      <Flex gap={3}>
        <Flex gap={1} alignItems="center">
          <Text whiteSpace="nowrap">{title}</Text>
          <Icon h={4} w={4}>
            <Info />
          </Icon>
        </Flex>
        <Flex gap={2} alignItems="center">
          <Text whiteSpace="nowrap" fontSize="md" fontWeight="bold">
            {primaryMetric}
          </Text>
          <Text whiteSpace="nowrap" fontSize="sm" color="textSubdued">
            {secondaryMetric}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export const MetricCards = () => {
  return (
    <Flex flexWrap="wrap" gap={2} w="fit-content">
      <MetricCard title="Average APY" primaryMetric="7.5%" secondaryMetric="$5,254.50" />
      <MetricCard
        title="Minimum to stack solo"
        primaryMetric="100,000 STX"
        secondaryMetric="to stack independently"
      />
    </Flex>
  );
};
