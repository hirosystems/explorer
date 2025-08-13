'use client';

import { FeeEstimates } from '@/app/context';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { useFeeEstimates } from '@/common/queries/useFeeEstimates';
import { getTxTypeIcon, getTxTypeLabel } from '@/common/utils/transactions';
import { MICROSTACKS_IN_STACKS } from '@/common/utils/utils';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StxThinIcon from '@/ui/icons/StacksThinIcon';
import { Box, Flex, HStack, Icon, Stack } from '@chakra-ui/react';
import { Info, Lightning, PlusMinus } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode, useRef } from 'react';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types';

interface FeeSectionProps {
  initialFeeEstimates?: FeeEstimates;
}

function SectionHeader() {
  const { tokenPrice } = useGlobalContext();
  return (
    <HStack align="center" justify={'space-between'} gap={2} flexWrap={'wrap'}>
      <HStack align="center" gap={2}>
        <Text textStyle="heading-sm" color="textPrimary">
          Estimated transaction fees
        </Text>
        <Tooltip
          content={
            <Box maxW={'400px'}>
              This chart shows current estimated fees for low, medium, and high priority
              transactions. Users can manually select a priority level in their wallets, with higher
              fees increasing the chances of faster confirmation.
            </Box>
          }
        >
          <Icon color="iconSecondary" h={3.5} w={3.5}>
            <Info />
          </Icon>
        </Tooltip>
      </HStack>
      <HStack
        align="center"
        gap={0.5}
        px="2"
        py="1.5"
        bg="surfacePrimary"
        borderRadius={'xs'}
        width="fit-content"
      >
        <Icon h={3} w={3} color="iconPrimary">
          <StxThinIcon />
        </Icon>
        <Text textStyle="text-mono-xs" color="textPrimary">
          1 STX = ${tokenPrice?.stxPrice?.toFixed(2)}
        </Text>
      </HStack>
    </HStack>
  );
}

function TabIcon({ children }: { children: ReactNode }) {
  return (
    <Icon w="3.5" h="3.5" color="iconPrimary">
      {children}
    </Icon>
  );
}

function FeeData({ title, ustxValue }: { title: ReactNode; ustxValue?: number }) {
  const { tokenPrice } = useGlobalContext();

  const stxValue =
    ustxValue !== undefined ? Number((ustxValue / MICROSTACKS_IN_STACKS).toFixed(4)) : undefined;
  const formattedStxValue = stxValue !== undefined && stxValue < 0.0001 ? '<0.0001' : stxValue;

  const dollarValue = stxValue !== undefined ? stxValue * tokenPrice.stxPrice : undefined;

  return (
    <Stack
      gap={2}
      px={4}
      pt={3}
      pb={2}
      borderRadius={'redesign.md'}
      border="1px solid"
      borderColor="redesignBorderSecondary"
      flex="1"
      minWidth="fit-content"
    >
      <Text textStyle="text-medium-lg" color="textPrimary">
        {title}
      </Text>
      <HStack align="center" gap={1} whiteSpace={'nowrap'}>
        <Text textStyle="text-mono-sm" color="textPrimary">
          {formattedStxValue === undefined ? 'N/A' : `${formattedStxValue} STX`}
        </Text>
        <Text textStyle="text-mono-sm" color="textSecondary">
          /
        </Text>
        <Text textStyle="text-mono-sm" color="textSecondary">
          {dollarValue === undefined
            ? 'N/A'
            : dollarValue < 0.01
              ? '<$0.01'
              : `$${dollarValue.toFixed(2)}`}
        </Text>
      </HStack>
    </Stack>
  );
}

function getFeeDescription(txType: keyof MempoolFeePriorities) {
  switch (txType) {
    case 'all':
      return 'Current average fee rates for all transaction types.';
    case 'smart_contract':
      return 'Current fee rates for smart contract deployments.';
    case 'token_transfer':
      return 'Current fee rates for token and NFT transfers.';
    case 'contract_call':
      return 'Current fee rates for contract calls (i.e: swapping, minting, or buying tokens and NFTs).';
    default:
      return 'Current fee rates for all transaction types.';
  }
}

const txTypeFees = ['all', 'token_transfer', 'contract_call', 'smart_contract'] as Array<
  keyof MempoolFeePriorities | 'all'
>;

function FeeSkeleton() {
  return (
    <Stack gap={4} w="100%">
      <Stack gap={3}>
        <Flex gap={2} flexWrap={'wrap'} rowGap={2}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} h={10} w={20} bg="surfacePrimary" borderRadius="md" opacity={0.6} />
          ))}
        </Flex>
        <Flex gap={2} flexWrap={'wrap'}>
          {[...Array(3)].map((_, i) => (
            <Stack
              key={i}
              gap={2}
              px={4}
              pt={3}
              pb={2}
              borderRadius={'redesign.md'}
              border="1px solid"
              borderColor="redesignBorderSecondary"
              flex="1"
              minWidth="fit-content"
            >
              <Box h={5} bg="surfacePrimary" borderRadius="sm" opacity={0.6} />
              <Box h={4} bg="surfacePrimary" borderRadius="sm" opacity={0.4} />
            </Stack>
          ))}
        </Flex>
        <Box h={4} bg="surfacePrimary" borderRadius="sm" opacity={0.4} w="60%" />
      </Stack>
    </Stack>
  );
}

function FeeTabs({ feeEstimates }: { feeEstimates?: FeeEstimates }) {
  if (!feeEstimates) {
    return <FeeSkeleton />;
  }

  const feeEstimatesMap = {
    all: feeEstimates.averageFees,
    token_transfer: feeEstimates.tokenTransferFees,
    contract_call: feeEstimates.contractCallFees,
    smart_contract: feeEstimates.contractDeployFees,
  };

  return (
    <TabsRoot variant={'primary'} size={'redesignMd'} defaultValue={'all'} gap="4">
      <Stack gap={4} w="100%">
        <Stack gap={3}>
          <TabsList flexWrap={'wrap'} rowGap={2}>
            {txTypeFees.map(txType => (
              <TabsTrigger key={txType} value={txType} gap={1}>
                <TabIcon>{txType === 'all' ? <PlusMinus /> : getTxTypeIcon(txType)}</TabIcon>
                <Text textStyle={'text-medium-sm'} color="textPrimary">
                  {txType === 'all' ? 'Average' : getTxTypeLabel(txType)}
                </Text>
              </TabsTrigger>
            ))}
          </TabsList>
          <Flex>
            {txTypeFees.map(txType => (
              <TabsContent key={txType} value={txType}>
                <Stack gap={4}>
                  <Flex gap={2} flexWrap={'wrap'}>
                    <FeeData title="Low" ustxValue={feeEstimatesMap[txType]?.low_priority} />
                    <FeeData
                      title="Standard"
                      ustxValue={feeEstimatesMap[txType]?.medium_priority}
                    />
                    <FeeData
                      title={
                        <Flex align={'center'} gap={0.5}>
                          High{' '}
                          <Icon w="4" h="4" color="iconTertiary">
                            <Lightning weight="fill" />
                          </Icon>
                        </Flex>
                      }
                      ustxValue={feeEstimatesMap[txType]?.high_priority}
                    />
                  </Flex>
                  <Text textStyle="text-regular-xs" color="textSecondary">
                    {getFeeDescription(txType)}
                  </Text>
                </Stack>
              </TabsContent>
            ))}
          </Flex>
        </Stack>
      </Stack>
    </TabsRoot>
  );
}

export function FeeSection({ initialFeeEstimates }: FeeSectionProps) {
  const queryClient = useQueryClient();
  const isCacheSetWithInitialData = useRef(false);

  if (isCacheSetWithInitialData.current === false && initialFeeEstimates) {
    queryClient.setQueryData(['feeEstimates'], initialFeeEstimates);
    isCacheSetWithInitialData.current = true;
  }

  const { data: feeEstimates, error } = useFeeEstimates();

  return (
    <Stack
      align="space-between"
      bg="surfaceSecondary"
      borderRadius={'xl'}
      p="6"
      gap="4"
      flex="1"
      width="100%"
      height="100%"
      justifyContent="center"
    >
      <SectionHeader />
      {error ? (
        <Text color="textSecondary" textAlign="center">
          Unable to load fee estimates
        </Text>
      ) : (
        <FeeTabs feeEstimates={feeEstimates} />
      )}
    </Stack>
  );
}
