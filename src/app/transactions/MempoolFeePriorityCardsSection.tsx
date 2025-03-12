import { Box, Flex, FlexProps, HStack, Icon, Separator, Stack } from '@chakra-ui/react';
import {
  CaretCircleDoubleUp,
  CaretCircleDown,
  CaretCircleUp,
  MinusCircle,
} from '@phosphor-icons/react';
import { Suspense, useMemo } from 'react';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types/generated';

import { Card } from '../../common/components/Card';
import { getTxTypeIcon } from '../../common/components/TxIcon';
import { useSuspenseMempoolFee } from '../../common/queries/useMempoolFee';
import { TokenPrice } from '../../common/types/tokenPrice';
import { MICROSTACKS_IN_STACKS, capitalize, getUsdValue } from '../../common/utils/utils';
import { Text } from '../../ui/Text';
import { Tooltip } from '../../ui/Tooltip';
import {
  TransactionTypeFilterMenu,
  TransactionTypeFilterTypes,
  mapTransactionTypeToFilterValue,
} from './TransactionTypeFilterMenu';
import { MempoolFeePriorityCardsSectionSkeleton } from './skeleton';

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

export const MempoolFeePriorityCardTransactionTypeFeeStatLineLayout = ({
  icon,
  fee,
  tooltipContent,
}: {
  icon: React.ReactNode;
  fee: React.ReactNode;
  tooltipContent: React.ReactNode;
}) => {
  return (
    <Tooltip content={tooltipContent}>
      <Flex gap={0.5} alignItems={'center'} justifyContent={'center'} color="textSubdued">
        <Icon h={3.5} w={3.5} mr={2}>
          {icon}
        </Icon>
        <Box
          fontSize="12px"
          style={{ fontVariantNumeric: 'tabular-nums' }}
          fontWeight="medium"
          suppressHydrationWarning
        >
          {fee}
        </Box>
      </Flex>
    </Tooltip>
  );
};

export function MempoolFeePriorityCardLayout({
  title,
  mainText,
  secondaryText,
  txTypeFeeStatLines,
}: {
  title: React.ReactNode;
  txTypeFeeStatLines: React.ReactNode;
  mainText: React.ReactNode;
  secondaryText: React.ReactNode;
} & Omit<FlexProps, 'title'>) {
  return (
    <Card padding={6}>
      <Stack gap={4}>
        {title}
        <Stack
          gap={4}
          alignItems="flex-start"
          separator={
            <Separator borderColor={'transactions.mempoolFeePriorityCard.borderColor'} w="full" />
          }
        >
          <Stack gap={1}>
            {mainText}
            {secondaryText}
          </Stack>
          <Stack gap={3} alignItems="flex-start">
            {txTypeFeeStatLines}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

export const MempoolFeePriorityCardTitleLayout = ({
  priority,
}: {
  priority: keyof MempoolFeePriorities['all'];
}) => {
  const title = capitalize(priority.replaceAll('_', ' '));

  return (
    <Flex gap={2}>
      {getFeePriorityIcon(priority)}
      <Text fontSize={'xs'} fontWeight="semibold" whiteSpace={'nowrap'}>
        {title}
      </Text>
    </Flex>
  );
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

  const titleContent = <MempoolFeePriorityCardTitleLayout priority={priority} />;

  const mainText = (
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
  );

  const secondaryText = (
    <Text fontSize={'sm'} color={'textSubdued'} whiteSpace={'nowrap'}>
      {getUsdValue(mempoolFeeAll, stxPrice, true)}
    </Text>
  );

  const txTypeFeeStatLinesContent = isTxTypeFiltered ? null : (
    <>
      <MempoolFeePriorityCardTransactionTypeFeeStatLineLayout
        icon={getTxTypeIcon('token_transfer')}
        fee={`${Number((mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS).toFixed(3))} STX`}
        tooltipContent={`Token transfer tx fee: ${
          mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS
        } STX`}
      />
      <MempoolFeePriorityCardTransactionTypeFeeStatLineLayout
        icon={getTxTypeIcon('contract_call')}
        fee={`${Number((mempoolFeeContractCall / MICROSTACKS_IN_STACKS).toFixed(3))} STX`}
        tooltipContent={`Contract call tx fee: ${
          mempoolFeeContractCall / MICROSTACKS_IN_STACKS
        } STX`}
      />
      <MempoolFeePriorityCardTransactionTypeFeeStatLineLayout
        icon={getTxTypeIcon('smart_contract')}
        fee={`${Number((mempoolFeeSmartContract / MICROSTACKS_IN_STACKS).toFixed(3))} STX`}
        tooltipContent={`Smart contract tx fee: ${
          mempoolFeeSmartContract / MICROSTACKS_IN_STACKS
        } STX`}
      />
    </>
  );

  return (
    <MempoolFeePriorityCardLayout
      title={titleContent}
      mainText={mainText}
      secondaryText={secondaryText}
      txTypeFeeStatLines={txTypeFeeStatLinesContent}
    />
  );
}

export const MempoolFeePriorityCards = ({
  tokenPrice,
  filteredMempoolFeeResponse,
  transactionType,
}: {
  tokenPrice: TokenPrice;
  filteredMempoolFeeResponse: MempoolFeePriorities;
  transactionType: TransactionTypeFilterTypes;
}) => {
  return (
    <>
      <MempoolFeePriorityCard
        mempoolFeeResponse={filteredMempoolFeeResponse}
        priority={'no_priority'}
        stxPrice={tokenPrice.stxPrice}
        txTypeFilter={transactionType}
      />
      <MempoolFeePriorityCard
        mempoolFeeResponse={filteredMempoolFeeResponse}
        priority={'low_priority'}
        stxPrice={tokenPrice.stxPrice}
        txTypeFilter={transactionType}
      />
      <MempoolFeePriorityCard
        mempoolFeeResponse={filteredMempoolFeeResponse}
        priority={'medium_priority'}
        stxPrice={tokenPrice.stxPrice}
        txTypeFilter={transactionType}
      />
      <MempoolFeePriorityCard
        mempoolFeeResponse={filteredMempoolFeeResponse}
        priority={'high_priority'}
        stxPrice={tokenPrice.stxPrice}
        txTypeFilter={transactionType}
      />
    </>
  );
};

export function MempoolFeePriorityCardsLayout({
  mempoolFeePriorityCards,
  transactionType,
  setTransactionType,
}: {
  mempoolFeePriorityCards: React.ReactNode;
  transactionType: TransactionTypeFilterTypes;
  setTransactionType: (transactionType: TransactionTypeFilterTypes) => void;
}) {
  return (
    <Flex padding={6} justifyContent="center" flexDirection="column">
      <Flex
        mb={9}
        display="grid"
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
        justifyContent={['center', 'center', 'space-between']}
      >
        <Flex justifyContent={['center', 'center', 'flex-start']}>
          <Box
            fontSize="xs"
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
          {mempoolFeePriorityCards}
        </HStack>
      </Flex>
    </Flex>
  );
}

export function MempoolFeePriorityCardsSectionBase({
  tokenPrice,
  transactionType,
  setTransactionType,
}: {
  tokenPrice: TokenPrice;
  transactionType: TransactionTypeFilterTypes;
  setTransactionType: (transactionType: TransactionTypeFilterTypes) => void;
}) {
  const mempoolFeeResponse = useSuspenseMempoolFee().data as MempoolFeePriorities;

  const mappedTxType = mapTransactionTypeToFilterValue(transactionType);

  const filteredMempoolFeeResponse = useMemo(() => {
    const filteredMempoolFeeResponse = { ...mempoolFeeResponse };
    Object.keys(filteredMempoolFeeResponse).forEach(key => {
      if (mappedTxType !== 'all' && key !== mappedTxType) {
        delete filteredMempoolFeeResponse[key as keyof typeof filteredMempoolFeeResponse];
      }
    });
    return filteredMempoolFeeResponse;
  }, [mappedTxType, mempoolFeeResponse]);

  return (
    <Suspense fallback={<MempoolFeePriorityCardsSectionSkeleton />}>
      <MempoolFeePriorityCardsLayout
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        mempoolFeePriorityCards={
          <MempoolFeePriorityCards
            tokenPrice={tokenPrice}
            filteredMempoolFeeResponse={filteredMempoolFeeResponse}
            transactionType={transactionType}
          />
        }
      />
    </Suspense>
  );
}

export function MempoolFeePriorityCardsSection({
  tokenPrice,
  transactionType,
  setTransactionType,
}: {
  tokenPrice: TokenPrice;
  transactionType: TransactionTypeFilterTypes;
  setTransactionType: (transactionType: TransactionTypeFilterTypes) => void;
}) {
  return (
    <Suspense fallback={<MempoolFeePriorityCardsSectionSkeleton />}>
      <MempoolFeePriorityCardsSectionBase
        tokenPrice={tokenPrice}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />
    </Suspense>
  );
}
