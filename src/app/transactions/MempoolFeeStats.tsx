import { Box, Flex, FlexProps, HStack, Icon, StackSeparator, VStack } from '@chakra-ui/react';
import {
  CaretCircleDoubleUp,
  CaretCircleDown,
  CaretCircleUp,
  MinusCircle,
} from '@phosphor-icons/react';
import { useMemo, useState } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types/generated';

import { Card } from '../../common/components/Card';
import { getTxTypeIcon } from '../../common/components/TxIcon';
import { useSuspenseMempoolFee } from '../../common/queries/useMempoolFee';
import { useSuspenseMempoolTransactionStats } from '../../common/queries/useMempoolTxStats';
import { TokenPrice } from '../../common/types/tokenPrice';
import { MICROSTACKS_IN_STACKS, capitalize, getUsdValue } from '../../common/utils/utils';
import { Text } from '../../ui/Text';
import { Tooltip } from '../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { MempoolFeePieChart, getTxTypePieChartColor } from './MempoolFeePieChart';
import {
  TransactionTypeFilterMenu,
  TransactionTypeFilterTypes,
  mapTransactionTypeToFilterValue,
} from './TransactionTypeFilterMenu';

export const getFeePriorityIcon = (priority: keyof MempoolFeePriorities['all']) => {
  switch (priority) {
    case 'no_priority':
      return (
        <Icon h={4} w={4} color="slate.600">
          <MinusCircle />
        </Icon>
      );
    case 'low_priority':
      return (
        <Icon h={4} w={4} color="red.600">
          <CaretCircleDown />
        </Icon>
      );
    case 'medium_priority':
      return (
        <Icon h={4} w={4} color="orange.600">
          <CaretCircleUp />
        </Icon>
      );
    case 'high_priority':
      return (
        <Icon h={4} w={4} color="green.600">
          <CaretCircleDoubleUp />
        </Icon>
      );
    default:
      throw new Error('Invalid priority');
  }
};

function MempoolFeePriorityCard({
  mempoolFeeResponse,
  priority,
  stxPrice,
  txTypeFilter,
}: {
  mempoolFeeResponse: MempoolFeePriorities;
  priority: keyof MempoolFeePriorities['all'];
  stxPrice: number;
  txTypeFilter: TransactionTypeFilterTypes;
} & FlexProps) {
  const isTxTypeFiltered = txTypeFilter !== TransactionTypeFilterTypes.AverageForAllTransactions;
  const mempoolFeeAll = isTxTypeFiltered
    ? mempoolFeeResponse?.[
        mapTransactionTypeToFilterValue(txTypeFilter) as keyof MempoolFeePriorities
      ]?.[priority] || 0
    : mempoolFeeResponse?.all?.[priority] || 0;
  const mempoolFeeTokenTransfer = mempoolFeeResponse?.token_transfer?.[priority] || 0;
  const mempoolFeeContractCall = mempoolFeeResponse?.contract_call?.[priority] || 0;
  const mempoolFeeSmartContract = mempoolFeeResponse?.smart_contract?.[priority] || 0;

  const title = capitalize(priority.replaceAll('_', ' '));

  return (
    <Card padding={6}>
      <Flex gap={2} mb={4}>
        {getFeePriorityIcon(priority)}
        <Text fontSize={'xs'} fontWeight="semibold" whiteSpace={'nowrap'}>
          {title}
        </Text>
      </Flex>
      <VStack
        separator={
          <StackSeparator borderColor={'transactions.mempoolFeePriorityCard.borderColor'} />
        }
        gap={4}
        alignItems="flex-start"
      >
        <Box>
          <Text
            fontWeight="medium"
            fontSize={'xl'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            color={'text'}
            mb={1}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {mempoolFeeAll / MICROSTACKS_IN_STACKS} STX
          </Text>
          <Text fontSize={'sm'} color={'textSubdued'} whiteSpace={'nowrap'}>
            {getUsdValue(mempoolFeeAll, stxPrice, true)}
          </Text>
        </Box>
        {isTxTypeFiltered ? null : (
          <VStack gap={3} alignItems="flex-start">
            <Tooltip
              content={`Token transfer tx fee: ${
                mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS
              } STX`}
            >
              <Flex gap={0.5} alignItems={'center'} justifyContent={'center'} color="textSubdued">
                <Icon h={3.5} w={3.5} mr={2}>
                  {getTxTypeIcon('token_transfer')}
                </Icon>
                <Box
                  fontSize="12px"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                  fontWeight="medium"
                  suppressHydrationWarning
                >
                  {`${Number((mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
                </Box>
              </Flex>
            </Tooltip>
            <Tooltip
              content={`Contract call tx fee: ${
                mempoolFeeContractCall / MICROSTACKS_IN_STACKS
              } STX`}
            >
              <Flex gap={0.5} alignItems={'center'} justifyContent={'center'} color="textSubdued">
                <Icon h={3.5} w={3.5} mr={2}>
                  {getTxTypeIcon('contract_call')}
                </Icon>
                <Box
                  fontSize="12px"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                  fontWeight="medium"
                  suppressHydrationWarning
                >
                  {`${Number((mempoolFeeContractCall / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
                </Box>
              </Flex>
            </Tooltip>
            <Tooltip
              content={`Smart contract tx fee: ${
                mempoolFeeSmartContract / MICROSTACKS_IN_STACKS
              } STX`}
            >
              <Flex gap={0.5} alignItems={'center'} justifyContent={'center'} color="textSubdued">
                <Icon h={3.5} w={3.5} mr={2}>
                  {getTxTypeIcon('smart_contract')}
                </Icon>
                <Box
                  fontSize="12px"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                  fontWeight="medium"
                  suppressHydrationWarning
                >
                  {`${Number((mempoolFeeSmartContract / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
                </Box>
              </Flex>
            </Tooltip>
          </VStack>
        )}
      </VStack>
    </Card>
  );
}

export function MempoolFeeStats({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const mempoolFeeResponse = useSuspenseMempoolFee().data as MempoolFeePriorities;
  const mempoolTransactionStats = useSuspenseMempoolTransactionStats().data;

  const [transactionType, setTransactionType] = useState<TransactionTypeFilterTypes>(
    TransactionTypeFilterTypes.AverageForAllTransactions
  );

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

  const filteredMempoolFeeResponse = useMemo(() => {
    const filteredMempoolFeeResponse = { ...mempoolFeeResponse };
    Object.keys(filteredMempoolFeeResponse).forEach(key => {
      if (mappedTxType !== 'all' && key !== mappedTxType) {
        delete filteredMempoolFeeResponse[key as keyof typeof filteredMempoolFeeResponse];
      }
    });
    return filteredMempoolFeeResponse;
  }, [mappedTxType, mempoolFeeResponse]);

  const totalTxCount = Object.entries(filteredTxTypeCounts).reduce((acc, [key, val]) => {
    return acc + val;
  }, 0);

  return (
    <Card>
      <HStack
        alignItems="flex-start"
        display={'grid'}
        gridColumnStart={'1'}
        gridColumnEnd={['2', '2', '3']}
        gridTemplateColumns={['100%', '100%', '260px 1fr']}
        width="100%"
      >
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
            fontSize="12px"
            fontStyle="normal"
            fontWeight={600}
            lineHeight="20px"
            letterSpacing="-0.12px"
          >
            IN MEMPOOL
          </Box>
          <Flex alignItems="center" margin="16px 0px">
            <MempoolFeePieChart
              filteredTxTypeCounts={filteredTxTypeCounts}
              totalTxCount={totalTxCount}
            />
          </Flex>
          <VStack gap={3} alignItems="flex-start">
            {Object.entries(filteredTxTypeCounts).map(([key, value]) => {
              const icon = getTxTypeIcon(key as Transaction['tx_type']);
              const text =
                key === 'token_transfer'
                  ? 'Token transfer'
                  : key === 'contract_call'
                    ? 'Function call'
                    : key === 'smart_contract'
                      ? 'Contract deploy'
                      : null;
              const bg = getTxTypePieChartColor(key);

              return (
                <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
                  <Box h={2.5} w={2.5} borderRadius="50%" mr={2} backgroundColor={bg} />
                  <Icon
                    h={3.5}
                    w={3.5}
                    mr={2}
                    color={'transactions.mempoolFeePriorityCard.textColor'}
                  >
                    {icon}
                  </Icon>
                  <Text
                    suppressHydrationWarning
                    color={'transactions.mempoolFeePriorityCard.textColor'}
                    fontSize="12px"
                  >
                    {text ? `${value} ${text}` : null}
                  </Text>
                </Flex>
              );
            })}
          </VStack>
        </Flex>
        <Flex padding={6} justifyContent="center" flexDirection="column">
          <Flex
            mb={9}
            display="grid"
            gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
            justifyContent={['center', 'center', 'space-between']}
          >
            <Flex justifyContent={['center', 'center', 'flex-start']}>
              <Box
                fontSize="12px"
                fontStyle="normal"
                fontWeight={600}
                lineHeight="20px"
                letterSpacing="-0.12px"
                marginBottom={[5, 5, 0, 0]}
              >
                CURRENT FEE RATES
              </Box>
            </Flex>
            <Flex justifyContent={['center', 'center', 'flex-end']}>
              <TransactionTypeFilterMenu
                transactionType={transactionType}
                setTransactionType={setTransactionType}
              />
            </Flex>
          </Flex>
          <Flex alignItems="center" height="100%">
            <HStack
              gap={3}
              display={'grid'}
              gridColumnStart={'1'}
              gridColumnEnd={['3', '3', '4']}
              gridTemplateColumns={[
                '100%',
                '100%',
                'minmax(0, 1fr) minmax(0, 1fr)',
                'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
              ]}
              width="100%"
            >
              <MempoolFeePriorityCard
                mempoolFeeResponse={filteredMempoolFeeResponse}
                priority={'no_priority'}
                stxPrice={tokenPrice.stxPrice}
                borderRightWidth={['0px', '0px', '1px', '1px']}
                txTypeFilter={transactionType}
              />
              <MempoolFeePriorityCard
                mempoolFeeResponse={filteredMempoolFeeResponse}
                priority={'low_priority'}
                stxPrice={tokenPrice.stxPrice}
                borderRightWidth={['0px', '0px', '0px', '1px']}
                txTypeFilter={transactionType}
              />
              <MempoolFeePriorityCard
                mempoolFeeResponse={filteredMempoolFeeResponse}
                priority={'medium_priority'}
                stxPrice={tokenPrice.stxPrice}
                borderRightWidth={['0px', '0px', '1px', '1px']}
                txTypeFilter={transactionType}
              />
              <MempoolFeePriorityCard
                mempoolFeeResponse={filteredMempoolFeeResponse}
                priority={'high_priority'}
                stxPrice={tokenPrice.stxPrice}
                txTypeFilter={transactionType}
              />
            </HStack>
          </Flex>
        </Flex>
      </HStack>
    </Card>
  );
}

export function MempoolFeeStatsWithErrorBoundary({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <MempoolFeeStats tokenPrice={tokenPrice} />
    </ExplorerErrorBoundary>
  );
}
