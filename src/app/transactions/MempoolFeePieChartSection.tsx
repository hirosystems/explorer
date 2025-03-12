import { getTxTypeIcon } from '@/common/components/TxIcon';
import { useSuspenseMempoolTransactionStats } from '@/common/queries/useMempoolTxStats';
import { Box, Flex, Icon, VStack } from '@chakra-ui/react';
import { Suspense, useMemo } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types/generated';

import { Text } from '../../ui/Text';
import { MempoolFeePieChart, getTxTypePieChartColor } from './MempoolFeePieChart';
import {
  TransactionTypeFilterTypes,
  mapTransactionTypeToFilterValue,
} from './TransactionTypeFilterMenu';
import { MempoolFeePieChartSectionSkeleton } from './skeleton';

export const MempoolFeeStatLineLayout = ({
  icon,
  text,
  dotBg,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
  dotBg: string;
}) => {
  return (
    <Flex gap={2} alignItems={'center'} justifyContent={'center'}>
      <Box h={2.5} w={2.5} borderRadius="50%" backgroundColor={dotBg} />
      <Icon h={3.5} w={3.5} color={'transactions.mempoolFeePriorityCard.textColor'}>
        {icon}
      </Icon>
      <Text color={'transactions.mempoolFeePriorityCard.textColor'} fontSize="xs">
        {text}
      </Text>
    </Flex>
  );
};

export const MempoolFeeStatLines = ({
  filteredTxTypeCounts,
}: {
  filteredTxTypeCounts: Record<string, number>;
}) => {
  const statLines = Object.entries(filteredTxTypeCounts).map(([key, value]) => {
    const icon = getTxTypeIcon(key as Transaction['tx_type']);
    const text =
      key === 'token_transfer'
        ? `${value} Token transfer`
        : key === 'contract_call'
          ? `${value} Function call`
          : key === 'smart_contract'
            ? `${value} Contract deploy`
            : null;

    return (
      <MempoolFeeStatLineLayout
        key={key}
        icon={icon}
        text={text}
        dotBg={getTxTypePieChartColor(key)}
      />
    );
  });

  return <>{statLines}</>;
};

export const MempoolFeePieChartSectionLayout = ({
  pieChart,
  statLines,
}: {
  pieChart: React.ReactNode;
  statLines: React.ReactNode;
}) => {
  return (
    <Flex
      padding={6}
      flexDirection="column"
      borderRight={[
        'none',
        'none',
        '1px solid var(--stacks-colors-border-primary)',
        '1px solid var(--stacks-colors-border-primary)',
      ]}
      borderBottom={[
        '1px solid var(--stacks-colors-border-primary)',
        '1px solid var(--stacks-colors-border-primary)',
        'none',
        'none',
      ]}
      height="100%"
      width="100%"
      alignItems={['center', 'center', 'flex-start']}
    >
      <Box
        fontSize="xs"
        fontStyle="normal"
        fontWeight={600}
        lineHeight="20px"
        letterSpacing="-0.12px"
      >
        IN MEMPOOL
      </Box>
      <Flex alignItems="center" margin="16px 0px">
        {pieChart}
      </Flex>
      <VStack gap={3} alignItems="flex-start">
        {statLines}
      </VStack>
    </Flex>
  );
};

export function MempoolFeePieChartSectionWithSuspenseBase({
  transactionType,
}: {
  transactionType: TransactionTypeFilterTypes;
}) {
  const mempoolTransactionStats = useSuspenseMempoolTransactionStats().data;

  const txTypeCounts = mempoolTransactionStats?.tx_type_counts;

  const mappedTxType = mapTransactionTypeToFilterValue(transactionType);

  const filteredTxTypeCounts = useMemo(() => {
    const { poison_microblock, ...filteredTxTypeCounts } = txTypeCounts || {};
    Object.keys(filteredTxTypeCounts).forEach(key => {
      if (mappedTxType !== 'all' && key !== mappedTxType) {
        delete filteredTxTypeCounts[key as keyof typeof filteredTxTypeCounts];
      }
    });
    return filteredTxTypeCounts;
  }, [txTypeCounts, mappedTxType]);

  const totalTxCount = Object.entries(filteredTxTypeCounts).reduce((acc, [key, val]) => {
    return acc + val;
  }, 0);

  return (
    <MempoolFeePieChartSectionLayout
      pieChart={
        <MempoolFeePieChart
          filteredTxTypeCounts={filteredTxTypeCounts}
          totalTxCount={totalTxCount}
        />
      }
      statLines={<MempoolFeeStatLines filteredTxTypeCounts={filteredTxTypeCounts} />}
    />
  );
}

export const MempoolFeePieChartSection = ({
  transactionType,
}: {
  transactionType: TransactionTypeFilterTypes;
}) => {
  return (
    <Suspense fallback={<MempoolFeePieChartSectionSkeleton />}>
      <MempoolFeePieChartSectionWithSuspenseBase transactionType={transactionType} />
    </Suspense>
  );
};
