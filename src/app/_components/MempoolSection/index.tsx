'use client';

import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { ButtonLink } from '@/ui/ButtonLink';
import { Text } from '@/ui/Text';
import { Flex, HStack, Stack } from '@chakra-ui/react';

import { TxCountChart } from './TxCountChart';

interface MempoolSectionProps {
  showHeader?: boolean;
  mempoolStats?: any;
  isSSRDisabled?: boolean;
  chartWidth?: number;
  chartHeight?: number;
  chartInnerRadius?: number;
}

function SectionHeader() {
  const network = useGlobalContext().activeNetwork;
  return (
    <HStack align="center" justify={'space-between'}>
      <Text textStyle="heading-md" color="textPrimary">
        Mempool
      </Text>
      <ButtonLink
        href={buildUrl('/mempool', network)}
        buttonLinkSize="big"
        display={{ base: 'none', md: 'inline' }}
        mr={2}
      >
        View mempool
      </ButtonLink>
    </HStack>
  );
}

function TxCountSection({
  mempoolStats,
  chartWidth,
  chartHeight,
  chartInnerRadius,
}: {
  mempoolStats?: any;
  chartWidth?: number;
  chartHeight?: number;
  chartInnerRadius?: number;
}) {
  return (
    <HStack
      align="center"
      bg="surfaceSecondary"
      borderRadius={'xl'}
      p="6"
      pl={['6', '6', '8']}
      flex="1"
      height="100%"
      alignSelf="stretch"
      justifyContent={'center'}
    >
      <Flex maxW={'800px'} flexGrow="1">
        <TxCountChart
          mempoolStats={mempoolStats}
          width={chartWidth}
          height={chartHeight}
          innerRadius={chartInnerRadius}
        />
      </Flex>
    </HStack>
  );
}

export function MempoolSection({
  showHeader = true,
  mempoolStats,
  isSSRDisabled = false,
  chartWidth,
  chartHeight,
  chartInnerRadius,
}: MempoolSectionProps) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Stack gap={6} flex={1} height="100%">
      {showHeader && <SectionHeader />}
      {isSSRDisabled ? (
        <Text>Loading mempool data...</Text>
      ) : (
        <TxCountSection
          mempoolStats={mempoolStats}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          chartInnerRadius={chartInnerRadius}
        />
      )}
      {showHeader && (
        <ButtonLink
          href={buildUrl('/mempool', network)}
          buttonLinkSize="big"
          display={{ base: 'inline', md: 'none' }}
        >
          View mempool
        </ButtonLink>
      )}
    </Stack>
  );
}
