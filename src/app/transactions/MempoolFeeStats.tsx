import { StackDivider, VStack, useColorModeValue } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  TbCircleChevronDown,
  TbCircleChevronUp,
  TbCircleChevronsUp,
  TbCircleMinus,
} from 'react-icons/tb';

import { MempoolFeePriorities } from '@stacks/blockchain-api-client/src/generated/models';
import { MempoolFeePrioritiesAll } from '@stacks/blockchain-api-client/src/generated/models/MempoolFeePrioritiesAll';

import { Card } from '../../common/components/Card';
import { getTxTypeIcon } from '../../common/components/TxIcon';
import { useSuspenseMempoolFee } from '../../common/queries/useMempoolFee';
import { useSuspenseMempoolTransactionStats } from '../../common/queries/useMempoolTxStats';
import { TokenPrice } from '../../common/types/tokenPrice';
import { MICROSTACKS_IN_STACKS, capitalize, getUsdValue } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { Icon } from '../../ui/Icon';
import { Text } from '../../ui/Text';
import { Tooltip } from '../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { MempoolFeePieChart, getTxTypePieChartColor } from './MempoolFeePieChart';
import {
  TransactionTypeFilterMenu,
  TransactionTypeFilterTypes,
  mapTransactionTypeToFilterValue,
} from './TransactionTypeFilterMenu';

export const getFeePriorityIcon = (priority: keyof MempoolFeePrioritiesAll) => {
  switch (priority) {
    case 'no_priority':
      return <Icon as={TbCircleMinus} size={4} color="slate.600" />;
    case 'low_priority':
      return <Icon as={TbCircleChevronDown} size={4} color="red.600" />;
    case 'medium_priority':
      return <Icon as={TbCircleChevronUp} size={4} color="orange.600" />;
    case 'high_priority':
      return <Icon as={TbCircleChevronsUp} size={4} color="green.600" />;
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
  priority: keyof MempoolFeePrioritiesAll;
  stxPrice: number;
  txTypeFilter: TransactionTypeFilterTypes;
} & FlexProps) {
  const borderColor = useColorModeValue('slate.200', 'slate.800');
  const isTxTypeFiltered = txTypeFilter !== TransactionTypeFilterTypes.AverageForAllTransactions;
  const mempoolFeeAll = isTxTypeFiltered
    ? mempoolFeeResponse?.[mapTransactionTypeToFilterValue(txTypeFilter)]?.[priority] || 0
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
        divider={<StackDivider borderColor={borderColor} />}
        spacing={4}
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
              label={`Token transfer tx fee: ${
                mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS
              } STX`}
            >
              <Flex gap={0.5} alignItems={'center'} justifyContent={'center'} color="textSubdued">
                <Icon as={getTxTypeIcon('token_transfer')} size={3.5} mr={2} />
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
              label={`Contract call tx fee: ${mempoolFeeContractCall / MICROSTACKS_IN_STACKS} STX`}
            >
              <Flex gap={0.5} alignItems={'center'} justifyContent={'center'} color="textSubdued">
                <Icon as={getTxTypeIcon('contract_call')} size={3.5} mr={2} />
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
              label={`Smart contract tx fee: ${
                mempoolFeeSmartContract / MICROSTACKS_IN_STACKS
              } STX`}
            >
              <Flex gap={0.5} alignItems={'center'} justifyContent={'center'} color="textSubdued">
                <Icon as={getTxTypeIcon('smart_contract')} size={3.5} mr={2} />
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

  const textColor = useColorModeValue('slate.700', 'slate.500');

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
            '1px solid var(--stacks-colors-borderPrimary)',
            '1px solid var(--stacks-colors-borderPrimary)',
          ]}
          borderBottom={[
            '1px solid var(--stacks-colors-borderPrimary)',
            '1px solid var(--stacks-colors-borderPrimary)',
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
              const icon = getTxTypeIcon(key as keyof typeof filteredTxTypeCounts);
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
                  <Box size="9px" borderRadius="50%" mr={2} backgroundColor={bg} />
                  <Icon as={icon} size={3.5} mr={2} color={textColor} />
                  <Text suppressHydrationWarning color={textColor} fontSize="12px">
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
