import { Card } from '@/common/components/Card';
import { Flex } from '@/ui/Flex';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import { Info } from '@phosphor-icons/react';

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
    <Card bg="sand.150" p={2} h="fit-content">
      <Flex gap={3}>
        <Flex gap={1} alignItems="center">
          <Text>{title}</Text>
          <Icon as={Info} size={4} />
        </Flex>
        <Flex gap={2} alignItems="center">
          <Text fontSize="md" fontWeight="bold">
            {primaryMetric}
          </Text>
          <Text fontSize="sm" color="textSubdued">
            {secondaryMetric}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export const MetricCards = () => {
  return (
    <Flex gap={2} alignItems="flex-end">
      <MetricCard title="Average APY" primaryMetric="7.5%" secondaryMetric="$5,254.50" />
      {/* <MetricCard title="Average Slot" primaryMetric="0.00924 BTC" secondaryMetric="$305.53" /> */}
      <MetricCard
        title="Minimum to stack solo"
        primaryMetric="100,000 STX"
        secondaryMetric="to stack independently"
      />
    </Flex>
  );
};
