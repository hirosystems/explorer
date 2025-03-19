import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { Link } from '@/ui/Link';
import { Text } from '@/ui/Text';
import { HStack, Icon } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

import { TimeframeSelector } from '../../../common/components/TimeframeSelector';
import { useNetworkOverviewContext } from './NetworkOverviewContextProvider';

export function SectionHeader() {
  const network = useGlobalContext().activeNetwork;
  const { selectedTimeframe, setSelectedTimeframe } = useNetworkOverviewContext();
  return (
    <HStack align="center" justify={'space-between'}>
      <HStack gap={4}>
        <Text whiteSpace={'nowrap'} textStyle="heading-md" color="textPrimary">
          Network Overview
        </Text>
        <TimeframeSelector
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
        />
      </HStack>
      <Link
        href={buildUrl('/', network)}
        variant={'buttonLink'}
        size={'lg'}
        aria-label="View analytics"
        display="inline-flex"
        gap={1}
      >
        View analytics
        <Icon w={3.5} h={3.5} aria-hidden="true">
          <ArrowRight />
        </Icon>
      </Link>
    </HStack>
  );
}
