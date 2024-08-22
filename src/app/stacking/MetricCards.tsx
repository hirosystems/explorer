import { Card } from '@/common/components/Card';
import { Flex } from '@/ui/Flex';
import { Grid } from '@/ui/Grid';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import { VStack } from '@chakra-ui/react';
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
    <Card bg="#F3F2F0" p={4}>
      <VStack gap={2} alignItems="flex-start">
        <Flex>
          <Text>{title}</Text>
          <Icon as={Info} size={4} />
        </Flex>
        <Flex alignItems="flex-end" gap={2}>
          <Text fontSize="md" fontWeight="bold">
            {primaryMetric}
          </Text>
          <Text fontSize="sm" color="textSubdued">
            {secondaryMetric}
          </Text>
        </Flex>
      </VStack>
    </Card>
  );
};

export const MetricCards = () => {
  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mt={6} w="full">
      <MetricCard title="Average APY" primaryMetric="7.5%" secondaryMetric="$5,254.50" />
      <MetricCard title="Average Slot" primaryMetric="0.00924 BTC" secondaryMetric="$305.53" />
      <MetricCard
        title="Estimated Minimum"
        primaryMetric="100,000 STX"
        secondaryMetric="to stack independently"
      />
    </Grid>
  );
};
